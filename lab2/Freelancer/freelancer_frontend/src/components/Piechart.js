import React, { Component } from "react";
import ReactSvgPieChart from "react-svg-piechart";




class Piechart extends Component {

    render() {
        var transactions = this.props.data;
        console.log('Transaction:', transactions);
        let data = [];
        var totalCreditAmount = 0;
        var totalDebitAmount = 0;
        for(var i = 0; i < transactions.length; i++) {
            if(transactions[i].transactiontype === 'debit') {
                totalDebitAmount += transactions[i].amount;
            }
            if(transactions[i].transactiontype === 'credit') {
                totalCreditAmount += transactions[i].amount
            }
        }

        data.push({
            title: 'credit',
            value:  totalCreditAmount,
            color: "#ffff66"
        })

        data.push({
            title: 'debit',
            value: totalDebitAmount,
            color: "#ffa500"
        })


        console.log("My new data is :",data);
        return(
            <div className='Piechart'>


                <div className='container-fluid col-md-5'>
                    <br/>
                    <h4>Pie Chart of Credit/Debit transactions</h4>
                    <br/>
                    <input type='text' id='incomingtransaction' disabled value='Credit Transactions'/>
                    <br/>
                    <input type='text' id='outgoingtransaction' disabled value='Debit Transactions'/>

                    <ReactSvgPieChart data={data}
                                      expandOnHover={true}
                                      expandSize={5}
                                      shrinkOnTouchEnd={true}
                                      strokeColor="#fff"
                                      strokeLinejoin="round"
                                      strokeWidth={1}
                                      viewBoxSize={100}
                    />
                </div>

            </div>

        );
    }

}

export default Piechart;


