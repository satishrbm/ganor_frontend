import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Button, FormControl, FormHelperText, OutlinedInput } from '@mui/material';
import config from '../../Utils/config';
import Loader from '../../Component/Loader';

const validationSchema = Yup.object().shape({
  customer_name: Yup.string().required("ગ્રાહકનું નામ દાખલ કરો"),
  addresss: Yup.string().required("સરનામું દાખલ કરો"),
  grand_total: Yup.number().required("કુલ રકમ દાખલ કરો"),
  bills: Yup.array().of(
    Yup.object().shape({
      product: Yup.string().required("પ્રોડક્ટ દાખલ કરો"),
      quantity: Yup.number().required("જથ્થો દાખલ કરો"),
      rate: Yup.number().required("દર દાખલ કરો"),
      total_amount: Yup.number().required("કુલ રકમ દાખલ કરો"),
    })
  ).required('બિલ્સ હોવી જ જોઈએ').min(1, 'કમથી કમ 1 બિલ હોવું જોઈએ')
});

const initialValues = {
  customer_name: '',
  addresss: '',
  grand_total: 0,
  bills: [
    {
      product: '',
      quantity: 1,
      rate: 0,
      total_amount: 0,
    }
  ]
};

const BillForm = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values) => {
    const formattedValues = {
      customer: {
        customer_name: values.customer_name,
        addresss: values.addresss,
        grand_total: values.grand_total,
      },
      bills: values.bills.map(bill => ({
        product: bill.product,
        quantity: bill.quantity,
        rate: bill.rate,
        total_amount: bill.total_amount,
      }))
    };
    try {
      setLoading(true);
      axios
    .post(`${config.BaseURL}/api/bill/create-customer-and-bills/`, formattedValues)
    .then((response) => {
      setLoading(false);
      console.log('Success:', response.data);
      // Uncomment and use this if you need to set the trip number
      // setTripNumber(response.data.order_number);
    })
    .catch((err) => {
      setLoading(false);
      alert(err.response?.data?.error || 'An error occurred'); // Add fallback for error message
    });
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
    // try {
    //   const response = await axios.post(`${config.BaseURL}/api/bill/create-customer-and-bills/`, formattedValues);
    //   console.log('Success:', response.data);
    // } catch (error) {
    //   console.error('Error:', error);
    // }
  };

  return (
    <>
      {loading ? <Loader /> : null}      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => handleSubmit(values)}
      >
        
        {({values,errors,touched,handleChange,handleBlur,handleSubmit,isSubmitting,}) => (
          <Form onSubmit={handleSubmit}>
            <div className="flexTab-content">
              <div className="inputDiv-customer">
                <FormControl className="inputFormControl" error={Boolean(touched.customer_name && errors.customer_name)}>
                  <FormHelperText className="inputLabel">ગ્રાહકનું નામ</FormHelperText>
                  <OutlinedInput
                    className="outlineInputChange"
                    variant="outlined"
                    placeholder="ગ્રાહકનું નામ દાખલ કરો"
                    type="text"
                    name="customer_name"
                    value={values.customer_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.customer_name && errors.customer_name && (
                    <FormHelperText error>{errors.customer_name}</FormHelperText>
                  )}
                </FormControl>
              </div>

              <div className="inputDiv-customer">
                <FormControl className="inputFormControl" error={Boolean(touched.addresss && errors.addresss)}>
                  <FormHelperText className="inputLabel">સરનામું</FormHelperText>
                  <OutlinedInput
                    className="outlineInputChange"
                    variant="outlined"
                    placeholder="સરનામું દાખલ કરો"
                    type="text"
                    name="addresss"
                    value={values.addresss}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.addresss && errors.addresss && (
                    <FormHelperText error>{errors.addresss}</FormHelperText>
                  )}
                </FormControl>
              </div>

              <div className="inputDiv-customer">
                <FormControl className="inputFormControl" error={Boolean(touched.grand_total && errors.grand_total)}>
                  <FormHelperText className="inputLabel">કુલ રકમ</FormHelperText>
                  <OutlinedInput
                    className="outlineInputChange"
                    variant="outlined"
                    placeholder="કુલ રકમ દાખલ કરો"
                    type="number"
                    name="grand_total"
                    value={values.grand_total}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.grand_total && errors.grand_total && (
                    <FormHelperText error>{errors.grand_total}</FormHelperText>
                  )}
                </FormControl>
              </div>

              <FieldArray name="bills">
                {({ insert, remove, push }) => (
                  <div style={{width:'100%'}}>
                    {values.bills.length > 0 &&
                      values.bills.map((bill, index) => (
                        <div key={index} style={{display:'flex', flexWrap:'wrap'}} className='listSectionTab'>
                          <div className='labelListSection'>
                            <h4 >પ્રોડક્ટ {index + 1}</h4>
                            <Button type="button" onClick={() => remove(index)} className='CloseXButton'>X</Button>
                          </div>
                          <div className="inputDiv-customer" style={{width:'23%'}}>
                            <FormControl className="inputFormControl" error={Boolean(touched.bills && touched.bills[index] && errors.bills && errors.bills[index] && errors.bills[index].product)}>
                              <FormHelperText className="inputLabel">પ્રોડક્ટ</FormHelperText>
                              <OutlinedInput
                                className="outlineInputChange"
                                variant="outlined"
                                placeholder="પ્રોડક્ટ દાખલ કરો"
                                type="text"
                                name={`bills.${index}.product`}
                                value={bill.product}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              {touched.bills && touched.bills[index] && errors.bills && errors.bills[index] && errors.bills[index].product && (
                                <FormHelperText error>{errors.bills[index].product}</FormHelperText>
                              )}
                            </FormControl>
                          </div>

                          <div className="inputDiv-customer" style={{width:'23%'}}>
                            <FormControl className="inputFormControl" error={Boolean(touched.bills && touched.bills[index] && errors.bills && errors.bills[index] && errors.bills[index].quantity)}>
                              <FormHelperText className="inputLabel">જથ્થો</FormHelperText>
                              <OutlinedInput
                                className="outlineInputChange"
                                variant="outlined"
                                placeholder="જથ્થો દાખલ કરો"
                                type="number"
                                name={`bills.${index}.quantity`}
                                value={bill.quantity}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              {touched.bills && touched.bills[index] && errors.bills && errors.bills[index] && errors.bills[index].quantity && (
                                <FormHelperText error>{errors.bills[index].quantity}</FormHelperText>
                              )}
                            </FormControl>
                          </div>

                          <div className="inputDiv-customer" style={{width:'23%'}}>
                            <FormControl className="inputFormControl" error={Boolean(touched.bills && touched.bills[index] && errors.bills && errors.bills[index] && errors.bills[index].rate)}>
                              <FormHelperText className="inputLabel">દર</FormHelperText>
                              <OutlinedInput
                                className="outlineInputChange"
                                variant="outlined"
                                placeholder="દર દાખલ કરો"
                                type="number"
                                name={`bills.${index}.rate`}
                                value={bill.rate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              {touched.bills && touched.bills[index] && errors.bills && errors.bills[index] && errors.bills[index].rate && (
                                <FormHelperText error>{errors.bills[index].rate}</FormHelperText>
                              )}
                            </FormControl>
                          </div>

                          <div className="inputDiv-customer" style={{width:'23%'}}>
                            <FormControl className="inputFormControl" error={Boolean(touched.bills && touched.bills[index] && errors.bills && errors.bills[index] && errors.bills[index].total_amount)}>
                              <FormHelperText className="inputLabel">કુલ રકમ</FormHelperText>
                              <OutlinedInput
                                className="outlineInputChange"
                                variant="outlined"
                                placeholder="કુલ રકમ દાખલ કરો"
                                type="number"
                                name={`bills.${index}.total_amount`}
                                value={bill.total_amount}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              {touched.bills && touched.bills[index] && errors.bills && errors.bills[index] && errors.bills[index].total_amount && (
                                <FormHelperText error>{errors.bills[index].total_amount}</FormHelperText>
                              )}
                            </FormControl>
                          </div>                        
                        </div>
                      ))}
                    <Button  className="searchButton" type="button" onClick={() => push({ product: '', quantity: 1, rate: 0, total_amount: 0, })}>પ્રોડક્ટ ઉમેરો</Button>
                  </div>
                )}
              </FieldArray>

              <Button type="submit" className="searchButton" style={{    position: 'fixed',bottom: 20,right: 30, zIndex:99}} >Submit</Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default BillForm;
