import API_CALL from "./API";

export const getStockReport = async (params, setValue, setTotalPage) => {
    try {
        const report = await API_CALL.get('report/stock', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
            params: { q: params.get('q'), page: params.get('page'), limit: 10, sort: params.get('sort'), store: params.get('store')}
        });
        
        setTotalPage(Math.ceil(report.data.result.count / 10))
        return setValue(report.data.result.rows);
    } catch (error) {
        console.error(error);
    }
};

export const getStore = async (setValue) => {
    try {
        const resStore = await API_CALL.get('store', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
        });
        setValue(resStore.data.result.raw);
    } catch (error) {
        console.error(error);
    }
};