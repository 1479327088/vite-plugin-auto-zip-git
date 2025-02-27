import archiver from 'archiver';
import { rimraf } from 'rimraf'
import * as fs from 'fs';
import * as path from 'path'
import { exec } from 'child_process';
const cwd = process.cwd()


export default function vitePluginAutoZipGit(){
    let conf = {
        build:{
            outDir: 'dist'
        }
    }
    let homedir = '';           // 打包目录，压缩包目录
    return{
        name:'vite-plugin-zip',
        enforce:'pre',
        apply: 'build', 
        version:'1.0.0',
        config(config){
            if(config.build?.outDir){
                Object.assign(conf,config);
            }
            homedir = path.join(cwd,conf.build.outDir);
        },
        buildEnd(){
            const zipPath = `${path.join(cwd,conf.build.outDir)}.zip`;
            rimraf(zipPath).then(res=>{
                if(res){
                        console.log(`
                            '-------------删除压缩包成功-------------'
                            *** 删除文件路径：${zipPath}
                            '---------------------------------------'
                            `);
                }
            }) 
        },
        closeBundle() {
            //执行git命令`
            const runGit = function(){
                exec('git pull && git add . && git commit -am "build(zip): 自动压缩打包，Git提交！" && git push',(error,stdout,stderr)=>{
                    console.log('stdout--->>>',stdout);
                    if(error){
                        console.log('error-->>',error);
                    }
                    if(stderr){
                        console.log('stderr-->>',stderr);
                    }
                })
            }
            // 删除文件
            const removeFile = function(){
                const zipPath = path.join(cwd,conf.build.outDir);
                rimraf(zipPath).then(res=>{
                    if(res){
                        console.log(`
                            '---------------删除文件成功--------------'
                            *** 删除文件名称：${zipPath}
                            '----------------------------------------'
                            `);
                        runGit()
                    }
                }) 
            }

            const zipPath = `${path.join(cwd,conf.build.outDir)}.zip`;
            let parsedPath = path.parse(homedir);

            const output = fs.createWriteStream(zipPath);
            const archive = archiver('zip', {
                zlib: { level: 9 } // 设置压缩级别
            });
            
            archive.on('error', function (err) {
                throw err;
            });
            
            output.on('close', function () {
                        console.log(`
                            '----------------压缩完毕------------------'
                            *** 生成文件大小：${(archive.pointer() / 1024 / 1024).toFixed(1)}MB
                            *** 文件系统路径：${path.join(cwd,conf.build.outDir)}.zip
                            '-----------------------------------------'
                        `);
                removeFile()
            });
            
            archive.pipe(output);
            archive.directory(path.join(cwd,conf.build.outDir), parsedPath.name)
            archive.finalize();
        }
    }
}