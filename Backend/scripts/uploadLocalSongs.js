require("dotenv").config({ path: __dirname + "/../.env" });
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { ImageKit } = require("@imagekit/nodejs");
const songModel = require("../src/models/song.model");

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

const SONGS_DIR = "C:\\Users\\ishtikhar\\Desktop\\song";

/**
 * Intelligent mood classifier based on title, artist, and keyword heuristics
 */
function classifyMood(filename, title, artist) {
    const lower = (filename + " " + title + " " + artist).toLowerCase();

    // 1. ANGRY / INTENSE
    if (
        lower.includes("jee karda") ||
        lower.includes("get ready to fight") ||
        lower.includes("da da dasse") ||
        lower.includes("vengeance") ||
        lower.includes("satan") ||
        lower.includes("bring me back") ||
        lower.includes("rage") ||
        lower.includes("fight")
    ) {
        return "angry";
    }

    // 2. FEARFUL / TENSE
    if (
        lower.includes("yaaram") ||
        lower.includes("deewana kar raha hai") ||
        lower.includes("wazir theme") ||
        lower.includes("parade de la bastille") ||
        lower.includes("khel khel mein") ||
        lower.includes("aayat") ||
        lower.includes("khoon choos le") ||
        lower.includes("ek thi daayan")
    ) {
        return "fearful";
    }

    // 3. DISGUSTED / RAW
    if (
        lower.includes("emotional fool") ||
        lower.includes("fake ishq") ||
        lower.includes("freak") ||
        lower.includes("party on my mind") ||
        lower.includes("locha-e-ulfat") ||
        lower.includes("kuch toh log kahenge") ||
        lower.includes("daingad daingad")
    ) {
        return "disgusted";
    }

    // 4. SAD / REFLECTIVE
    if (
        lower.includes("tum saath ho") ||
        lower.includes("agar tu hota") ||
        lower.includes("mat ja re") ||
        lower.includes("ro ne do") ||
        lower.includes("maula") ||
        lower.includes("yeh fitoor mera") ||
        lower.includes("bezubaan") ||
        lower.includes("wajah tum ho") ||
        lower.includes("tu bhoola jise") ||
        lower.includes("mainu ishq da") ||
        lower.includes("mar jaayen") ||
        lower.includes("baarish") ||
        lower.includes("tu mere paas") ||
        lower.includes("jeena marna") ||
        lower.includes("saathi rey") ||
        lower.includes("aye khuda") ||
        lower.includes("honedo batiya") ||
        lower.includes("phir bhi yeh zindagi") ||
        lower.includes("soch na sake (version 2)") ||
        lower.includes("tere liye mere kareem") ||
        lower.includes("o sathi mere") ||
        lower.includes("tu koi aur hai") ||
        lower.includes("samjhawan") ||
        lower.includes("nahin woh saamne") ||
        lower.includes("lonely") ||
        lower.includes("ab tohe jane na doongi") ||
        lower.includes("shayad") ||
        lower.includes("heer toh badi sad hai") ||
        lower.includes("sad")
    ) {
        return "sad";
    }

    // 5. SURPRISED / ENERGETIC (High Energy / Dance / Rap)
    if (
        lower.includes("malhari") ||
        lower.includes("chitta ve") ||
        lower.includes("ud-daa punjab") ||
        lower.includes("rock tha party") ||
        lower.includes("taang uthake") ||
        lower.includes("mera nachan nu") ||
        lower.includes("let's nacho") ||
        lower.includes("jabra fan") ||
        lower.includes("move on") ||
        lower.includes("oye oye") ||
        lower.includes("ghani bawri") ||
        lower.includes("dilliwaali girlfriend") ||
        lower.includes("high heels") ||
        lower.includes("brown rang") ||
        lower.includes("blue eyes") ||
        lower.includes("one bottle down") ||
        lower.includes("bom diggy diggy") ||
        lower.includes("d se dance") ||
        lower.includes("dj waley babu") ||
        lower.includes("let's talk about love") ||
        lower.includes("neendein khul jaati") ||
        lower.includes("veerey di wedding") ||
        lower.includes("vele") ||
        lower.includes("kukkad") ||
        lower.includes("disco") ||
        lower.includes("breakup party") ||
        lower.includes("angreji beat") ||
        lower.includes("bebo") ||
        lower.includes("main sharabi") ||
        lower.includes("punjabiyaan di battery") ||
        lower.includes("rani tu mein raja") ||
        lower.includes("dance basanti") ||
        lower.includes("lets celebrate") ||
        lower.includes("manali trance") ||
        lower.includes("saheli") ||
        lower.includes("sadi gali") ||
        lower.includes("dil dooba") ||
        lower.includes("titliyan") ||
        lower.includes("hass nache le") ||
        lower.includes("vadiya") ||
        lower.includes("fitoori") ||
        lower.includes("hulla re") ||
        lower.includes("ghagra") ||
        lower.includes("johnny johnny") ||
        lower.includes("iski uski") ||
        lower.includes("lucky tu lucky me") ||
        lower.includes("chali kahani")
    ) {
        return "surprised";
    }

    // 6. HAPPY / UPLIFTING
    if (
        lower.includes("gallan goodiyaan") ||
        lower.includes("kar gayi chull") ||
        lower.includes("badtameez dil") ||
        lower.includes("chaiyya chaiyya") ||
        lower.includes("chittiyaan kalaiyaan") ||
        lower.includes("banno") ||
        lower.includes("cham cham") ||
        lower.includes("buddhu sa mann") ||
        lower.includes("dil dhadakne do") ||
        lower.includes("matargashti") ||
        lower.includes("soch na sake") ||
        lower.includes("mast magan") ||
        lower.includes("offo") ||
        lower.includes("balam pichkari") ||
        lower.includes("saturday saturday") ||
        lower.includes("radha") ||
        lower.includes("the disco song") ||
        lower.includes("deewani mastani") ||
        lower.includes("journey song") ||
        lower.includes("saiyyan") ||
        lower.includes("tumhe apna banane ka") ||
        lower.includes("dil cheez tujhe dedi") ||
        lower.includes("pehli baar") ||
        lower.includes("tu isaq mera") ||
        lower.includes("ankhiyaan") ||
        lower.includes("malamaal") ||
        lower.includes("girls like to swing") ||
        lower.includes("mohe rang do laal") ||
        lower.includes("piku") ||
        lower.includes("wat wat wat") ||
        lower.includes("girl i need you") ||
        lower.includes("albela sajan") ||
        lower.includes("old school girl") ||
        lower.includes("pinga") ||
        lower.includes("aaj ibaadat") ||
        lower.includes("dheere dheere") ||
        lower.includes("pyar hua iqrar hua") ||
        lower.includes("bholi si surat") ||
        lower.includes("dil to pagal hai")
    ) {
        return "happy";
    }

    // 7. NEUTRAL / CALM (Pashmina, Ikk Kudi, Tum Se Hi, Safarnama, SubhanAllah, etc.)
    return "neutral";
}

/**
 * Intelligent metadata extractor for Bollywood song filenames
 */
function cleanSongMetadata(rawFilename) {
    let clean = rawFilename.replace(/\.mp3$/i, "");
    
    // Remove site tags and technical markers
    clean = clean.replace(/\[\s*Songspk\.[^\]]+\]/gi, "");
    clean = clean.replace(/Songspk\.[a-z]+/gi, "");
    clean = clean.replace(/\[\s*Songs\.PK\s*\]/gi, "");
    clean = clean.replace(/_Songs\.PK_/gi, "");
    clean = clean.replace(/\(320\s*kbps\)/gi, "");
    clean = clean.replace(/\(128\s*kbps\)/gi, "");
    clean = clean.replace(/www\.[a-z0-9\-_]+\.[a-z]+/gi, "");
    clean = clean.replace(/;;Singamda\.Com;;/gi, "");
    clean = clean.replace(/\(Apniisp\.Com\)/gi, "");
    clean = clean.replace(/\(PakHeaven\.Com\)/gi, "");
    clean = clean.replace(/\(MyMp3Song\.Com\)/gi, "");
    clean = clean.replace(/&quot;/gi, '"');

    // Remove leading numbering like "001.", "008.01 - ", "01 - "
    clean = clean.replace(/^\d+[\.\s\-_]+(\d+[\.\s\-_]+)*/, "");

    // Split by hyphen
    let parts = clean.split(/\s+-\s+/).map((p) => p.trim()).filter(Boolean);

    let title = "Bollywood Song";
    let artist = "Bollywood Artist";

    if (parts.length === 1) {
        title = parts[0];
    } else if (parts.length === 2) {
        title = parts[0];
        artist = parts[1];
    } else if (parts.length >= 3) {
        // e.g. "Fitoor - Pashmina - Amit Trivedi" or "Tamasha - Tum Saath Ho - Alka Yagnik"
        // If first part is a short movie name, combine or use second part as title
        if (parts[0].length < 15) {
            title = `${parts[1]} (${parts[0]})`;
            artist = parts.slice(2).join(" - ");
        } else {
            title = parts[0];
            artist = parts.slice(1).join(" - ");
        }
    }

    // Final cleanups
    title = title.replace(/^\d+\s*/, "").replace(/\[.*?\]/g, "").trim();
    artist = artist.replace(/^-\s*/, "").replace(/\[.*?\]/g, "").trim();

    if (!title || title.length < 2) title = "Bollywood Classic";
    if (!artist || artist.length < 2) artist = "Various Artists";

    return { title, artist };
}

async function uploadLocalSongs() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URL, { dbName: "MoodyPlayer" });
        console.log("Connected to MongoDB database 'MoodyPlayer'!");

        console.log("Cleaning up previous entries in MongoDB...");
        await songModel.deleteMany({});

        const files = fs.readdirSync(SONGS_DIR).filter((f) => f.toLowerCase().endsWith(".mp3"));
        console.log(`Processing ${files.length} original Bollywood MP3 files from ${SONGS_DIR}...`);

        let successCount = 0;

        for (let i = 0; i < files.length; i++) {
            const fileName = files[i];
            const filePath = path.join(SONGS_DIR, fileName);

            const { title, artist } = cleanSongMetadata(fileName);
            const mood = classifyMood(fileName, title, artist);

            console.log(`[${i + 1}/${files.length}] Uploading: "${title}" by ${artist} [Mood: ${mood}]...`);

            try {
                const fileBuffer = fs.readFileSync(filePath);
                const safeFileName = title.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 35) + "_" + (i + 1) + ".mp3";
                const uploadable = await ImageKit.toFile(fileBuffer, safeFileName);

                const uploadRes = await imagekit.files.upload({
                    file: uploadable,
                    fileName: safeFileName,
                    folder: "/songs",
                });

                await songModel.create({
                    title: title,
                    artist: artist,
                    mood: mood,
                    audio: uploadRes.url,
                });

                console.log(`  ✓ ImageKit URL: ${uploadRes.url}`);
                successCount++;
            } catch (err) {
                console.error(`  ✗ Error uploading "${fileName}":`, err.message);
            }
        }

        console.log(`\n🎉 Success! Uploaded & stored ${successCount} actual songs in MongoDB.`);

        const distinctMoods = await songModel.distinct("mood");
        console.log("\n--- MongoDB Collection Summary by Mood ---");
        for (const m of distinctMoods) {
            const count = await songModel.countDocuments({ mood: m });
            console.log(`Mood [${m}]: ${count} songs`);
        }
    } catch (err) {
        console.error("Process error:", err);
    } finally {
        await mongoose.disconnect();
        console.log("MongoDB disconnected.");
    }
}

uploadLocalSongs();
