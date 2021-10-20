const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const ffprobe = require("@ffprobe-installer/ffprobe");
const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const ffmpeg = require("fluent-ffmpeg")().setFfprobePath(ffprobe.path).setFfmpegPath(ffmpegInstaller.path);

const getMp4File = async () => {
    try {

        const filenames = await readdir('./')
        const foundedMp4File = filenames.find(filename => filename.includes('.mp4'))
        return foundedMp4File
    } catch (error) {
        throw new Error(`Error readding files! Error: ${error}`)
    }

}

const converter = (mp4File, gifFile) => {
    console.log('Starting converting...')

    return new Promise((resolve, reject) => {
        ffmpeg
            .input(mp4File)
            .output(gifFile)
            .on("end", () => {
                return resolve('Success!')
            })
            .on("error", (e) => {
                return reject(new Error(e))
            }).run()
    })
}

(async function main() {

    try {
        const mp4File = await getMp4File()
        const gifFile = `gif_${mp4File.split('.mp4')[0]}.gif`

        console.log(`Founded mp4 file "${mp4File}", will create ${gifFile}`)

        const response = await converter(mp4File, gifFile)
        console.log(response)

    } catch (error) {
        console.error(`Error converting to gif. '${error}'`)
    }

})()