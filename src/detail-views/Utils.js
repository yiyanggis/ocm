export const flattenGeojson = (feature) => {
    if (feature === undefined) {
        return null;
    }
    const p = feature.properties;
    const tags = p.tags;
    const rels = p.relations || [];
    return {
        name: p.name || tags.name,
        osmType: p.type,
        rels:  rels.map(item => item.reltags.name)
    }
}