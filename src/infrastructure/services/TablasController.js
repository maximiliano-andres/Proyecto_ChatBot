class ViewsTables{

    static verTablas(req,res){

        return res.status(200).render("tablas",
            {
                title: "Tablas de Amortizacion",error: ""
            })

    }
}

export default ViewsTables;