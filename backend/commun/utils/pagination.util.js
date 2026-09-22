/**
 * Utilitaires pour la pagination standardisée
 */

/**
 * Nettoie, valide et borne les paramètres de pagination issus de req.query
 * @param {Object} query - req.query de la requête Express
 * @param {number} defaultLimit - limite par défaut si non spécifiée (défaut: 10)
 * @param {number} maxLimit - limite maximale autorisée pour éviter les surcharges (défaut: 100)
 * @returns {{ page: number, limit: number, skip: number }}
 */
export const getPaginationParams = (query = {}, defaultLimit = 10, maxLimit = 100) => {
    // Forcer la page à un entier >= 1
    const page = Math.max(1, parseInt(query.page, 10) || 1);

    // Récupérer et borner la limite entre 1 et maxLimit
    const rawLimit = parseInt(query.limit, 10) || defaultLimit;
    const limit = Math.min(maxLimit, Math.max(1, rawLimit));

    // Calcul de l'offset
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

/**
 * Exécute en parallèle la requête de données et le comptage Mongoose,
 * puis retourne une réponse standardisée avec métadonnées de pagination.
 * 
 * @param {Promise|Query} dataQuery - La requête Mongoose pour récupérer les documents (find avec sort, skip, limit)
 * @param {Promise|Query} countQuery - La requête Mongoose de comptage (countDocuments)
 * @param {{ page: number, limit: number }} pagination - Paramètres page et limit
 * @returns {Promise<{ data: Array, pagination: { total: number, page: number, limit: number, totalPages: number, hasNextPage: boolean, hasPrevPage: boolean } }>}
 */
export const paginate = async (dataQuery, countQuery, { page, limit }) => {
    const [data, total] = await Promise.all([
        dataQuery,
        countQuery
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };
};
