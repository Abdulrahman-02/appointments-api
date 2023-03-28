const axios = require('axios');
const admin = require('firebase-admin');

// Generate QR code
exports.generateQR = async(req, res) => {
    try {
        const id = req.params.id;
        const size = '150x150';
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${id}`;
        
        const response = await axios.get(qrCodeUrl, { responseType: "arraybuffer" });

        const buffer = Buffer.from(response.data, "binary");

        // Store QR code in Firebase storage
        const bucket = admin.storage().bucket();
        const file = bucket.file(`qrcodes/${id}.png`);
        await file.save(buffer, { contentType: 'image/png' });

        // Update user's QR code field in Firebase database
        const userRef = admin.database().ref('users').child(id);
        await userRef.update({ qrcode: file.name });

        res.writeHead(200, {
            "Content-Type": "image/png",
            "Content-Length": buffer.length,
        });
        res.end(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong." });
    }
};


// Get QR code for user
exports.getQRCode = async (req, res) => {
    try {
        const id = req.params.id;

        // Get user's QR code file name from Firebase database
        const snapshot = await admin.database().ref(`users/${id}/qrcode`).once('value');
        const fileName = snapshot.val();

        // Get QR code file from Firebase storage
        const bucket = admin.storage().bucket();
        const file = bucket.file(fileName);
        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-09-2491'
        });

        // Return QR code URL
        res.json({ url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong." });
    }
};
