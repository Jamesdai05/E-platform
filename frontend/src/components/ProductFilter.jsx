import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Range, getTrackBackground } from "react-range";

const MIN = 0;
const MAX = 1000;
const step = 10;


// Turns the prices in the URL into slider positions. The slider throws an error on
// a value outside its range, and anyone can type a URL, so every value is made safe.
const getSliderValues = (minPrice, maxPrice) => {
    const toPosition = (value, fallback) => {
        const number = Number(value);
        if (value === undefined || Number.isNaN(number)) return fallback;
        return Math.min(MAX, Math.max(MIN, Math.round(number / step) * step));
    };

    const min = toPosition(minPrice, MIN);
    const max = toPosition(maxPrice, MAX);
    return min <= max ? [min, max] : [MIN, MAX];
};

const ProductFilter = ({minPrice,maxPrice,onApply,onReset}) => {
    // const [minInput, setMinInput] = useState(minPrice || "");
    // const [maxInput, setMaxInput] = useState(maxPrice || "");

    const [values, setValues] = useState(() => getSliderValues(minPrice, maxPrice));

    const submit = (e) => {
        e.preventDefault();
        // a handle at the end of the slider means no limit on that side
        onApply({
            minPrice: values[0] === MIN ? undefined : values[0],
            maxPrice: values[1] === MAX ? undefined : values[1],
        });
    };


    const reset = () => {
        setValues([MIN, MAX]);
        onReset();
    };


    return (
        <Form onSubmit={submit} className="p-3 border rounded mt-3">
            <h5>Filter By Price</h5>

            <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                    <span>${values[0]}</span>
                    <span>${values[1]}{values[1] === MAX && "+"}</span>
                </div>
            </div>

            <Range
                min={MIN}
                step={step}
                max={MAX}
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
                                min:MIN,
                                max:MAX,
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