import { NextApiRequest, NextApiResponse } from "next";
import { uploadFile } from "../../../lib/persistence/firebase";
import  formidable, { Fields, Files }  from  'formidable';
import { useAuth } from "../../../context/auth";

const  form = formidable({ multiples:  true });

export async function handle(req: NextApiRequest, res: NextApiResponse) {
    const session = {};

    if (session) {
        const { path } = req.query;

        const contentType = req.headers['content-type']
        
        console.log(path, contentType);
        if (contentType && contentType.indexOf('multipart/form-data') !== -1) {
            try {
                const ok = new Promise(
                    (resolve, reject) => {
                        req.on('data', () => {
                            console.log(req.complete);
                            form.parse(req, (err: any, fields: Fields, files: Files) => {
                                console.log(err, fields, files);
                                if (!err) {
                                    if (files instanceof Array) {
                                        console.log('isArray');
                                        Promise.all(
                                                files.map(
                                                    (file) => path instanceof Array ? uploadFile(path, 'teste', file) : uploadFile([path], 'teste', file)
                                                )
                                        ).then(ok => {
                                            console.log(ok);
                                            resolve(ok);
                                        }).catch(reason => {
                                            console.error(reason);
                                            reject(reason.message);
                                        })
                                    } else {
                                        console.log('notArray');
                                        console.log('Outro tipo de dado', files);
                                        path instanceof Array ? uploadFile(path, 'teste', files) : uploadFile([path], 'teste', files);
    
                                        resolve(`${path}/teste`);
                                    }
                                } else {
                                    console.log('isError');
                                    reject(err)
                                }
                            });
                        });
                    }
                );
                if (!(await ok.catch(reason => {throw reason; }))) {
                    console.log('resolved')
                    res.send(ok);
                } else {
                    console.log('notResolved')
                    res.send({error: 'Não catalogado'})
                }
            } catch (reason: any) {
                console.log('trycatch', [reason]);
                res.send({
                    error: reason.message
                })
            }
        } else {
            res.send({
                error: 'Conteúdo não permitido!',
            });
        }
    } else {
        res.send({
          error: "Você precisa estar logado para ver o conteúdo dessa página.",
        });
    }
}

export default handle;