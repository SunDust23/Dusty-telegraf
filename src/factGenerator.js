let { createClient } = require('pexels')
let Jimp = require('jimp')
const fs = require('fs')
let { facts } = require('./facts')

async function generateImage(imagePath, theme, fact) {
    // let fact = randomFact()
    // let theme = randomBackground()
   // let photo = await getRandomImage(theme.background)
   let photo = await getRandomImage(theme)
    await editImage(photo, imagePath, fact)
}

function randomFact() {
    let fact = facts[randomInteger(0, (facts.length - 1))];
    return fact;
}
function randomBackground() {
    let theme = themes[randomInteger(0, (themes.length - 1))];
    return theme;
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getRandomImage(background) {
    try {
        const client = createClient(process.env.PEXELS_API_KEY)
        const query = background
        let image

        await client.photos.search({ query, per_page: 10 }).then(res => {
            let images = res.photos
            image = images[randomInteger(0, (images.length - 1))]

        })

        return image

    } catch (error) {
        console.log('error downloading image', error)
        getRandomImage(background)
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////

async function editImage(image, imagePath, fact) {
    try {
        let imgURL = image.src.medium
        let newImage = await Jimp.read(imgURL).catch(error => console.log('error ', error))
        let newImageWidth = newImage.bitmap.width
        let newImageHeight = newImage.bitmap.height
        let imgDarkener = await new Jimp(newImageWidth, newImageHeight, '#000000')
        imgDarkener = await imgDarkener.opacity(0.5)
        newImage = await newImage.composite(imgDarkener, 0, 0);

        let posX = newImageWidth / 15
        let posY = newImageHeight / 15
        let maxWidth = newImageWidth - (posX * 2)
        let maxHeight = newImageHeight - posY

        let font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE)
        await newImage.print(font, posX, posY, {
            text: fact,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        }, maxWidth, maxHeight)

        await newImage.writeAsync(imagePath)
        console.log("Image generated successfully")

    } catch (error) {
        console.log("error editing image", error)
    }

}

const deleteImage = (imagePath) => {
    fs.unlink(imagePath, (err) => {
        if (err) {
            return
        }
        console.log('file deleted')
    })
}


module.exports = { generateImage, deleteImage }
