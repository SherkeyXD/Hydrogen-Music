const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
    packagerConfig: {
        asar: true,
        ignore: [
            "img",
        ],
    },
    makers: [
        {
            name: "@electron-forge/maker-zip",
            platforms: ["win32"], //, 'darwin', 'linux'],
        },
    ],
    plugins: [
        {
            name: "@electron-forge/plugin-auto-unpack-natives",
            config: {},
        },
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false
        })
    ],
};
