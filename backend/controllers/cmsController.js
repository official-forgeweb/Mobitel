const Cms = require('../models/Cms');

// Fallback initial data in case nothing exists yet in Mongo
const defaultHomeData = require('../data/cms.json');

const getCmsData = async (req, res) => {
    try {
        const slug = req.params.slug || 'home';

        let cmsDoc = await Cms.findOne({ pageSlug: slug });

        if (!cmsDoc) {
            // If requesting 'home' and it doesn't exist, seed it from our old local JSON
            if (slug === 'home') {
                try {
                    cmsDoc = await Cms.create({ pageSlug: 'home', data: defaultHomeData });
                } catch (seedError) {
                    console.warn("Could not seed default home CMS data:", seedError);
                    cmsDoc = { data: {} };
                }
            } else {
                cmsDoc = { data: {} };
            }
        }

        // Ensure returning exactly the same root format the frontend expects (the `data` object payload)
        res.json(cmsDoc.data || {});
    } catch (err) {
        console.error("Error reading CMS data:", err);
        res.status(500).json({ error: 'Failed to read CMS data from MongoDB' });
    }
};

const updateCmsData = async (req, res) => {
    try {
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        const slug = req.params.slug || 'home';

        // Find existing to merge 
        let cmsDoc = await Cms.findOne({ pageSlug: slug });

        if (!cmsDoc) {
            cmsDoc = new Cms({ pageSlug: slug, data: req.body });
        } else {
            cmsDoc.data = { ...cmsDoc.data, ...req.body };
        }

        await cmsDoc.save();
        res.json({ success: true, message: 'CMS data updated successfully', data: cmsDoc.data });
    } catch (err) {
        console.error("Error updating CMS data:", err);
        res.status(500).json({ error: 'Failed to update CMS data in MongoDB' });
    }
};

module.exports = {
    getCmsData,
    updateCmsData
};
