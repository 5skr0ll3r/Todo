const fs = require("fs").promises,
	path = require("path"),
	zlib = require('zlib');

class ErrorHandler{
	constructor(filePath){
//		if(filePath && !fs.existsSync(filePath)){
		this.filePath = filePath;
//		}
//		else{
//			throw new Error(`ErrorHandler-> filePath: ${filePath} already exists`)
//		}
		this.maxSizeInBytes = 120 * 1024 * 1024; //120mb
	}

	
	checkIfOverWeight(){
		fs.stat(this.filePath, async (error, stats)=>{
			if(error){
				console.error(error);
				return;
			}
			const fileSizeInBytes = stats.size;
			if(fileSizeInBytes > this.maxSizeInBytes){
				await this.zipAndWriteFile(this.filePath);
			}else{
				return;
			}
		})
	}

	async zipAndWriteFile(filePath){
		const readStream = fs.createReadStream(filePath);
		const writeStream = fs.createWriteStream(this.getZipFileName(filePath));
		const zip = zlib.createGzip();
		readStream.pipe(zip).pipe(writeStream);

		await new Promise((resolve) =>{
			writeStream.on('finish', async () => {
				this.filePath = this.generateNextFileName(this.filePath);
				await fs.unlink(filePath);
				resolve();
			});
		});
	}

	getZipFileName(originalFilePath){
		const parsedPath = path.parse(originalFilePath);
		const newFileName = `${parsedPath.name}.gz`;
		return path.join(parsedPath.dir, newFileName);
	}

	async generateNextFileName(originalFilePath){
		const parsedPath = path.parse(originalFilePath);
		let counter = 1;
		while (await fs.access(path.join(parsedPath.dir, `${parsedPath.name}${counter}${parsedPath.ext}`)).then(() => false).catch(() => true)) {
			counter++;
		}
		const newFileName = `${parsedPath.name}${counter}${parsedPath.ext}`;
		return path.join(parsedPath.dir, newFileName);
	}

	async reportErrorFile(req, error){
		try{
			await fs.appendFile(this.filePath, `${JSON.stringify({ reqUrl: req.url, reqBody: req.body, reqHeaders: req.headers, error })}\n`);
		}catch(errorHandlerError){
			try{
				await fs.appendFile(this.filePath, `${JSON.stringify({ reqUrl: req.url, reqBody: req.body, reqHeaders: req.headers, error })}\n`);
			}catch(error){
				console.error(error);
			}
		}
		await this.checkIfOverWeight();
	}
}


module.exports = ErrorHandler;
