const basicUrl = "http://127.0.0.1:8000/"

export const createAlert = async (searchString, targetPrice) => {
    try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            throw new Error('UserId não encontrado');
        }

        const response = await fetch(`${basicUrl}alerts/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                SearchString: searchString,
                target_price: targetPrice,
                userId
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar favoritos');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

export const getAlerts = async () => {
    try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            throw new Error('UserId não encontrado');
        }

        const response = await fetch(`${basicUrl}alerts/?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar alertas');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

export const deleteAlert = async (alertId) => {
    try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            throw new Error('UserId não encontrado');
        }

        const response = await fetch(`${basicUrl}alerts/delete/${alertId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar alerta');
        }

        return true;
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

export async function updateAlert(alertId, target_price) {
    const response = await fetch(`${basicUrl}/alerts/update/${alertId}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ target_price }),
    });

    if (!response.ok) throw new Error("Erro ao atualizar alerta");

    return await response.json();
}