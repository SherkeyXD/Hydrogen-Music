import server from "NeteaseCloudMusicApi/server";

//启动网易云音乐API
export default async function startNeteaseMusicApi() {
    await server.serveNcmApi({
        checkVersion: true,
        port: 36530,
    });
}
