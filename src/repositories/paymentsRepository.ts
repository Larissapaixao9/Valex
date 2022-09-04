import connection from "../database/pg";

export async function getPaymentsAndBusinessNameBycardId(id:number) {
    const result = await connection.query(`SELECT  payments.*,
    businesses.name as "businessName"
    FROM payments 
    JOIN businesses ON businesses.id=payments."businessId"
    WHERE "cardId"=$1`,[id])

    return result.rows;
}