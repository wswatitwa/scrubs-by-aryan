export const getColorHex = (name: string): string => {
    const raw = name.toLowerCase().trim();
    // Common Scrubs Colors Mapping
    const colorMap: { [key: string]: string } = {
        'navy': '#000080',
        'royal blue': '#4169E1',
        'ceil blue': '#92a1cf',
        'caribbean blue': '#0086cb',
        'teal': '#008080',
        'black': '#000000',
        'white': '#FFFFFF',
        'grey': '#808080',
        'charcoal': '#36454F',
        'pewter': '#696969',
        'hunter green': '#355E3B',
        'olive': '#808000',
        'wine': '#722F37',
        'burgundy': '#800020',
        'maroon': '#800000',
        'eggplant': '#614051',
        'purple': '#800080',
        'lavender': '#E6E6FA',
        'pink': '#FFC0CB',
        'hot pink': '#FF69B4',
        'red': '#FF0000',
        'galaxy blue': '#2A52BE',
        'electric blue': '#7DF9FF',
        'khaki': '#F0E68C',
        'beige': '#F5F5DC',
        'brown': '#A52A2A',
        'turquoise': '#40E0D0',
        'mauve': '#E0B0FF',
        'lilac': '#C8A2C8',
        'indigo': '#4B0082',
        'cyan': '#00FFFF',
        'magenta': '#FF00FF',
        'orange': '#FFA500',
        'yellow': '#FFFF00',
        'green': '#008000',
        'lime': '#00FF00',
        'silver': '#C0C0C0',
        'gold': '#FFD700'
    };

    return colorMap[raw] || '#000000'; // Default to Black if unknown
};
