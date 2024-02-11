import API_CALL from "./API";

export const getStockReport = async (params, setValue, setTotalPage, setLoading) => {
    try {
        setLoading && setLoading(true);
        const report = await API_CALL.get('report/stock', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
            params: { q: params.get('q'), page: params.get('page'), limit: 10, sort: params.get('sort'), store: params.get('store') }
        });

        setTotalPage(Math.ceil(report.data.result.count / 10))
        setValue(report.data.result.rows);
        setLoading && setLoading(false);
    } catch (error) {
        console.error(error);
    }
};

export const getStore = async (setValue, setLoading, setDefaultValue) => { //! Used on stock report page and create discount page
    try {
        setLoading && setLoading(true);
        const resStore = await API_CALL.get('store', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
        });
        setValue(resStore.data.result.raw);
        setLoading && setLoading(false);

        setDefaultValue && setDefaultValue(resStore.data.result.raw[0].UUID); //* Set store UUID as default value
    } catch (error) {
        console.error(error);
    }
};

export const getInventory = async (setValue, setLoading, queryParams, setDefaultValue) => {
    try {
        setLoading && setLoading(true);
        const res = await API_CALL.get('inventory', {
            params: queryParams,
        });

        setValue(res.data.result.rows);

        setDefaultValue && setDefaultValue(res.data.result.rows.length ? res.data.result.rows[0].id : null); //* Set inventory ID as default value

        setLoading && setLoading(false);
    } catch (error) {
        console.error(error);
    }
};

export const getDiscount = async (setValue, setLoading, setTotalPage, queryParams) => {
    try {
        setLoading && setLoading(true);
        const res = await API_CALL.get('discount', {
            params: queryParams,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        })
        setTotalPage && setTotalPage(parseInt(res.data.result?.totalPage || 1))
        setValue(res.data.result.rows);
        
        setLoading && setLoading(false);
    } catch (error) {
        console.error(error);
    }
};

export const deleteDiscount = async (ID, setLoading, getUpdatedData) => {
    try {
        setLoading && setLoading(true);
        
        await API_CALL.delete(`discount/${ID}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
        })
        getUpdatedData;
        setLoading && setLoading(false);
    } catch (error) {
        console.error(error);
    }
};

export const getCategory = async (setValue, setLoading, setTotalPage, queryParams) => {
    try {
        setLoading && setLoading(true);
        const res = await API_CALL.get('category', {
            params: queryParams,
        })
        setTotalPage && setTotalPage(parseInt(res.data.result?.totalPage || 1))
        setValue(res.data.result.rows);
        
        setLoading && setLoading(false);
    } catch (error) {
        console.error(error);
    }
};