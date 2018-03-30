import React, { Component } from 'react';
import Navbar from './Navbar';


class Makepayment extends Component {
    render() {
        return(

            <div className="Makepayment">
                <Navbar />
                <div id="divPaymentForm" >
                    <h1>Make Payment</h1>
                    <hr/>
                    <form>

                        <div className="form-group">
                            <label for="nameOnCard">Name on Card</label>
                            <input type="text" class="form-control col-lg-5" id="nameOnCard" />
                        </div>

                        <div className="form-group">
                            <label for="crediCardNum">Credit Card Number</label>
                            <input type="text" className="form-control col-lg-5" id="crediCardNum" />
                        </div>

                        <div class="form-group">
                            <label for="cvv">CVV:</label>
                            <input type="text" class="form-control col-sm-1" id="cvv" />
                        </div>

                        <div class="form-group">
                            <label for="expiryMonth">Expiry Month:</label>
                            <input type="text" class="form-control col-sm-1" id="expiryMonth" />
                        </div>

                        <div class="form-group">
                            <label for="expiryYear">Expiry Year:</label>
                            <input type="text" class="form-control col-sm-1" id="expiryYear" />
                        </div>



                        <button type="submit" class="btn btn-primary col-lg-5">Pay</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Makepayment;