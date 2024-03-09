export function jaroWinkler(s1: string, s2: string): number {
    const jaro = (str1: string, str2: string): number => {
        let m = 0;
        
        // If the strings are equal
        if (str1 === str2) return 1.0;
        
        // Length of two strings
        const len1 = str1.length,
              len2 = str2.length;
        
        // Maximum distance two characters can be apart to be considered matching
        // Adjusted for the length of the strings
        const matchDistance = Math.floor(Math.max(len1, len2) / 2) - 1;
        
        // Arrays to keep track of matches
        const str1Matches: boolean[] = new Array(len1).fill(false),
              str2Matches: boolean[] = new Array(len2).fill(false);
        
        for (let i = 0; i < len1; i++) {
            const start = Math.max(0, i - matchDistance);
            const end = Math.min(i + matchDistance + 1, len2);

            for (let j = start; j < end; j++) {
                if (str2Matches[j]) continue;
                if (str1[i] !== str2[j]) continue;
                str1Matches[i] = true;
                str2Matches[j] = true;
                m++;
                break;
            }
        }
        
        // If no matches found
        if (m === 0) return 0.0;
        
        // Count transpositions
        let k = 0;
        let numTrans = 0;
        for (let i = 0; i < len1; i++) {
            if (!str1Matches[i]) continue;
            while (!str2Matches[k]) k++;
            if (str1[i] !== str2[k]) numTrans++;
            k++;
        }
        
        let transpositions = numTrans / 2;
        
        // Calculate Jaro similarity
        const similarity = ((m / len1) + (m / len2) + ((m - transpositions) / m)) / 3.0;
        return similarity;
    };
    
    const jaroDistance = jaro(s1, s2);
    
    // Prefix scale for Winkler adjustment
    // Maximum of 4 characters are considered for the prefix
    const prefixScale = 0.1;
    
    let prefix = 0;
    for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
        if (s1[i] === s2[i]) prefix++;
        else break;
        if (prefix === 4) break;
    }
    
    const winklerAdjustment = prefix * prefixScale * (1 - jaroDistance);
    
    // Apply Winkler adjustment if Jaro distance is above a threshold (typically 0.7)
    // This condition can be adjusted based on specific use cases
    const threshold = 0.7;
    if (jaroDistance > threshold) {
        return jaroDistance + winklerAdjustment;
    } else {
        return jaroDistance;
    }
}
