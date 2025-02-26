const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");
const info = require("./package.json");

module.exports = {
    packagerConfig: {
        name: "Hydrogen Music",
        appBundleId: "com.sherkeyxd.hydrogen-music",
        productName: "Hydrogen Music",
        asar: true,
        ignore: (filepath) => {
            if (filepath.length === 0) {
                return false;
            }
            if (/^\/dist/.test(filepath)) {
                return false;
            }
            if (/^\/src/.test(filepath)) {
                return false;
            }
            if (/^\/package.json/.test(filepath)) {
                return false;
            }
            if (/^\/node_modules/.test(filepath)) {
                return false;
            }
            return true;
        },
        icon: "img/icon",
    },
    rebuildConfig: {
        buildPath: __dirname,
        extraModules: Object.keys(info.dependencies),
    },
    makers: [
        {
            name: "@electron-forge/maker-zip",
        },
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "hydrogen_music",
                setupIcon: "img/icon.ico",
            },
        },
        {
            name: "@electron-forge/maker-deb",
            config: {
                options: {
                    maintainer: "SherkeyXD",
                    homepage: "https://github.com/SherkeyXD/Hydrogen-Music",
                    icon: "img/icon",
                },
            },
        },
        {
            name: "@electron-forge/maker-rpm",
            config: {
                options: {
                    homepage: "https://github.com/SherkeyXD/Hydrogen-Music",
                    icon: "img/icon",
                },
            },
        },
    ],
    plugins: [
        {
            name: "@electron-forge/plugin-auto-unpack-natives",
            config: {},
        },
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
        }),
    ],
    publishers: [
        {
            name: "@electron-forge/publisher-github",
            config: {
                repository: {
                    owner: "SherkeyXD",
                    name: "Hydrogen-Music",
                },
            },
        },
    ],
};
