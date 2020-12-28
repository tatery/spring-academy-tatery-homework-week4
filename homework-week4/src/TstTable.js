import React from "react";

//npm install react-crud-table --save
//npm start

import CRUDTable, {
    Fields,
    Field,
    CreateForm,
    UpdateForm,
    DeleteForm
} from "react-crud-table";

// Component's Base CSS
import "./table.css";


const styles = {
    container: { margin: "auto", width: "fit-content" }
};

const elementHello = (
    <div>
        <h1>Hello!</h1>
        <h2>Good to see you here.</h2>
    </div>
);

class TstTable extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.input = React.createRef();
    }

    handleSubmit(event) {
        this.service.httpGetById(this.input.current.value);
        event.preventDefault();
    }

    render() {
        return (
            <div>
                {elementHello}
                <div style={styles.container}>
                    <CRUDTable
                        caption="Cars list"
                        items={this.state.carsList}
                    >
                        <Fields>
                            <Field name="id" label="Id" sortable={false} hideInCreateForm={true} hideInUpdateForm={true} />
                            <Field name="mark" label="Mark" sortable={false} />
                            <Field name="model" label="Model" sortable={false} />
                            <Field name="color" label="Color" sortable={false} />
                        </Fields>

                        <CreateForm
                            title="Car Creation"
                            message="Add a new car!"
                            trigger="Add car"
                            onSubmit={car => this.service.create(car)}
                            submitText="Create"
                            validate={values => {
                                const errors = {};
                                if (!values.mark) {
                                    errors.mark = "Please, provide mark";
                                }
                                if (!values.model) {
                                    errors.model = "Please, provide model";
                                }
                                if (!values.color) {
                                    errors.color = "Please, provide color";
                                }
                                return errors;
                            }}
                        />
                        <UpdateForm
                            title="Car Update Process"
                            message="Update car"
                            trigger="Update"
                            onSubmit={car => this.service.update(car)}
                            submitText="Update"
                            validate={values => {
                                const errors = {};
                                if (!values.mark) {
                                    errors.mark = "Please, provide mark";
                                }
                                if (!values.model) {
                                    errors.model = "Please, provide model";
                                }
                                if (!values.color) {
                                    errors.color = "Please, provide color";
                                }
                                return errors;
                            }}
                        />
                        <DeleteForm
                            title="Car Delete Process"
                            message="Are you sure you want to delete this car?"
                            trigger="Delete"
                            onSubmit={car => this.service.delete(car)}
                            submitText="Delete"
                            validate={values => {
                                const errors = {};
                                if (!values.id) {
                                    errors.id = "Please, provide id";
                                }
                                return errors;
                            }}
                        />
                    </CRUDTable>
                </div>
                <p></p>
                <form onSubmit={this.handleSubmit}>
                    <label>Display specific car, enter id:<input type="number" ref={this.input} /></label>
                    <input type="submit" value="Submit" />
                </form>
                <p>{this.state.car == null ? "" : "id: " + this.state.car.id + ", mark: " + this.state.car.mark + ", model: " + this.state.car.model + ", color: " + this.state.car.color}</p>
                
            </div>
        )
    }

    state = {
        carsList: [],
        count: 0,
        loading: true,
        car: null,
        errorMessage: ''
    }

    service = {
        create: car => {
            const len = this.state.carsList.push({
                ...car,
                id: this.state.count + 1
            });
            this.setState({ count: len });
            this.service.httpRequest(this.state.carsList[len - 1], 'POST')
            return Promise.resolve(car);
        },

        update: car => {
            const carUpd = this.state.carsList.find(t => t.id === car.id);
            carUpd.mark = car.mark;
            carUpd.model = car.model;
            carUpd.color = car.color;
            this.service.httpRequest(carUpd, 'PUT')
            return Promise.resolve(carUpd);
        },

        delete: car => {
            const carDel = this.state.carsList.find(t => t.id === car.id);
            this.setState({ carsList: this.state.carsList.filter(t => t.id !== car.id) });
            this.service.httpDeleteRequest(carDel)
            return Promise.resolve(carDel);
        },

        /////////////////////////////////////////////
        // PUT, POST
        httpRequest: (car, httpMethod) => {
            // HTTP request using fetch with error handling
            const requestOptions = {
                method: httpMethod,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(car)
            };

            fetch('http://localhost:9090/cars', requestOptions)
                .then(async response => {
                    //const data = await response;
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        //const error = (data && data.message) || response.status;
                        alert('Cannot create/update car, error reported by server: ' + response.status);
                        //return Promise.reject(error);
                    }

                    //this.setState({ postId: data.id })
                })
                .catch(error => {
                    this.setState({ errorMessage: error.toString() });
                    alert('There was an error: ' + error.toString());
                    console.error('There was an error!', error);
                });
        },

        // DELETE
        httpDeleteRequest: (car) => {
            const requestOptions = {
                method: 'DELETE'
            };

            fetch('http://localhost:9090/cars/' + car.id, requestOptions)
                .then(async response => {
                    //const data = await response;
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        //const error = (data && data.message) || response.status;
                        alert('Cannot delete car with ID: ' + car.id + ', error reported by server: ' + response.status);
                        //return Promise.reject(error);
                    }

                    this.setState({ postId: response.id })
                })
                .catch(error => {
                    this.setState({ errorMessage: error.toString() });
                    alert('There was an error: ' + error.toString());
                    console.error('There was an error!', error);
                });
        },

        httpGetById: id => {
            const requestOptions = {
                method: 'GET'
            };

            fetch('http://localhost:9090/cars/' + id, requestOptions)
                .then(async response => {
                    // check for error response
                    if (!response.ok) {
                        alert('Cannot display car with ID: ' + id + ', error reported by server: ' + response.status);
                        //return Promise.reject(error);
                    } else {
                        const data = await response.json();
                        this.setState({ car: data })
                    }
                })
                .catch(error => {
                    this.setState({ errorMessage: error.toString() });
                    alert('There was an error: ' + error.toString());
                    console.error('There was an error!', error);
                });

        }
    };

    componentDidMount() {
        fetch('http://localhost:9090/cars')
            .then(response => response.json())
            .then(carsList => {
                this.setState({ carsList })
                this.setState({ count: carsList.filter(m => m.id).length })
            });
    }

}

export default TstTable

