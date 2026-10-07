import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Range,getTrackBackground } from "react-range";


const ProductFilter = ({onApply,onReset}) => {
    // const [minInput, setMinInput] = useState(minPrice || "");
    // const [maxInput, setMaxInput] = useState(maxPrice || "");

    const [values, setValues] = useState([0, 1000]);

    const submit = (e) => {
        e.preventDefault();
        onApply({ minPrice: values[0], maxPrice: values[1] });
    };


    const reset = () => {
        setValues([0, 1000]);
        onReset();
    };


    return (
        <Form onSubmit={submit} className="p-3 border rounded">
            <h5>Filter By Price</h5>

            <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                    <span>${values[0]}</span>
                    <span>${values[1]}</span>
                </div>
            </div>

            <Range
                min={0}
                step={10}
                max={1000}
                values={values}
                onChange={(values) => setValues(values)}
                renderTrack={({ props, children })=>(
                    <div {...props} style={{
                        ...props.style,
                        height: "6px",
                        width: "100%",
                        background:getTrackBackground(
                            {
                                values,
                                colors:["#ddd","#0d6efd","#ddd"],
                                min:0,
                                max:1000,
                            }),
                    }}>
                        {children}
                    </div>
                )}
                renderThumb={
                    ({ props }) => (
                        <div
                            {...props}
                            style={{
                                ...props.style,
                                height: "24px",
                                width: "24px",
                                borderRadius: "50%",
                                backgroundColor:"#0d6efd",
                            }}
                        ></div>
                    )
                }
            />

            <div className="d-grid gap-2 mt-4">
                <Button type="submit">Apply</Button>
                <Button type="button" variant="outline-secondary" onClick={reset}>Reset</Button>
            </div>
        </Form>
    )
};


export default ProductFilter;