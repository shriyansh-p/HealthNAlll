import axios from 'axios';

const api = axios.create({
    baseURL: 'https://exercisedb.p.rapidapi.com',
    headers: {
        'X-RapidAPI-Key': '0c68c44b11mshdf22afc5753038dp1741b7jsna706f6bbaa4a',
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
        'Accept': 'application/json',
    },
    timeout: 10000,
});

// Fetch all body parts
export const getBodyParts = async () => {
    try {
        const { data } = await api.get('/exercises/bodyPartList');
        return data;
    } catch (err) {
        console.error('Failed to fetch body parts:', err.message);
        // Fallback defaults
        return ['back', 'cardio', 'chest', 'lower arms', 'lower legs',
            'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'];
    }
};

// Fetch and filter exercises

  export const searchExercises = async (query = '', bodyPart = 'all') => {
    try {
        let data = [];

        if (bodyPart === 'all') {
            // Get everything (limited to 1300)
            const response = await api.get('/exercises', {
                params: { limit: 1300 },
            });
            data = response.data;
        } else {
            // Get only exercises for the specific body part
            const response = await api.get(`/exercises/bodyPart/${bodyPart}`);
            data = response.data;
        }

        // Apply search filter if query exists
        if (query.trim()) {
            const q = query.toLowerCase();
            data = data.filter(exercise =>
                exercise.name.toLowerCase().includes(q)
            );
            console.log(`Filtered exercises by "${query}":`, data.length);
        }

        return data;
    } catch (err) {
        console.error('Search failed:', err.message);
        throw err;
    }
};

