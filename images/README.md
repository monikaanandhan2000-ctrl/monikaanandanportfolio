# Adding your images

The portfolio is already wired up to display your images automatically —
you just need to drop files into the right folders using the **exact file
names** below. Nothing else needs to change.

## 1. Profile photo
Folder: `images/profile/`
File name: `profile.jpg`

This is the large photo in the hero section at the top of the page.

## 2. Gallery images
Folder: `images/gallery/`
File names (add any or all of these):
- `work-1.jpg`
- `work-2.jpg`
- `team-1.jpg`
- `edtech-1.jpg`
- `media-1.jpg`
- `event-1.jpg`

Until an image is added, that tile shows a soft placeholder telling you
exactly which file to add — so you always know what's missing.

## 3. Want more gallery tiles, or different file names?
Open `js/data.js` and find the `GALLERY` list near the bottom. Add a new
line like this:

```js
{ file: "images/gallery/your-file-name.jpg", label: "Whatever you like" },
```

Then drop a matching image into `images/gallery/` with that same file name.

## 4. Logos folder
Folder: `images/logos/` is reserved if you'd like to add partner or
platform logos later (e.g. Razegreen Technologies, NVteck Technologies,
Ascendx Staffing Solutions, Rudrastic Innovations, AvenMinds). Not wired
into the page by default — ask to have a "Partners" strip added if you'd
like these displayed.

## Tips
- `.jpg`, `.jpeg`, `.png` and `.webp` all work — just make sure the file
  extension in `data.js` / this list matches the file you add.
- Square or portrait images work best for the gallery tiles (4:3 crop).
- The profile photo works best as a portrait image (4:5 crop).
