import './Hr.css';
import React from "react";
import Employee from "./model/employee";

class Hr extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            employee: new Employee(),
            employees: []
        }
    }

    handleInputChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        let employee = {...this.state.employee};
        if (name === "fulltime")
            employee.fulltime = !employee.fulltime;
        else
            employee[name] = value;
        this.setState({employee})
    }

    handleFileChange = (event) => {
        const filename = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            let employee = {...this.state.employee};
            employee.photo = e.target.result;
            this.setState({employee})
        }
        reader.readAsDataURL(filename);
    }

    hireEmployee = () => {
        let employee = {...this.state.employee};
        fetch("http://localhost:9100/hr/api/v1/employees",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(employee)
            }).then(response => response.json())
            .then(response => {
                if (response.hasOwnProperty('message'))
                    alert(response.message);
                else {
                    alert("Employee is hired!");
                    let employees = [...this.state.employees]
                    employees.push(response);
                    this.setState({employees});
                }
            })
    }

    updateEmployee = () => {
        let employee = {...this.state.employee};
        let request = {...employee}
        delete request.identity;

        fetch(`http://localhost:9100/hr/api/v1/employees/${employee.identity}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(request)
            }).then(response => response.json())
            .then(responseBody => alert("Employee is updated!"))
    }

    fireEmployee = (param) => {
        let identity = param;
        if (param.hasOwnProperty('target'))
            identity = this.state.employee.identity;
        fetch(`http://localhost:9100/hr/api/v1/employees/${identity}`,
            {
                method: "DELETE",
                headers: {
                    "Accept": "application/json"
                }
            }).then(response => response.json())
            .then(response => {
                    if (response.hasOwnProperty('message'))
                        alert(response.message)
                    else {
                        alert("Employee is fired!");
                        let employees = this.state.employees.filter(
                            employee => employee.identity !== identity);
                        this.setState({employees});
                    }
                }
            )
    }


    findEmployeeByIdentity = () => {
        let identity = this.state.employee.identity;
        fetch(`http://localhost:9100/hr/api/v1/employees/${identity}`,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }).then(response => response.json())
            .then(response => {
                if (!response.hasOwnProperty("message"))
                    this.setState({employee: response});
                else
                    alert(response.message)
            })
    }

    copyRow = (employee) => {
        this.setState({employee});
    }

    findEmployees = () => {
        fetch("http://localhost:9100/hr/api/v1/employees?page=0&size=10",
            {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }).then(response => response.json())
            .then(employees => {
                this.setState({employees});
            })
    }

    render() {
        return (
            <div className="container">
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title">Employee</h4>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="identityNo">Identity No:</label>
                            <input id="identityNo"
                                   name="identity"
                                   onChange={this.handleInputChange}
                                   value={this.state.employee.identity}
                                   type="text"
                                   className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Full Name:</label>
                            <input id="name"
                                   name="fullname"
                                   value={this.state.employee.fullname}
                                   onChange={this.handleInputChange}
                                   type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="salary">Salary:</label>
                            <input id="salary"
                                   name="salary"
                                   onChange={this.handleInputChange}
                                   value={this.state.employee.salary}
                                   type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="iban">Iban:</label>
                            <input id="iban"
                                   name="iban"
                                   onChange={this.handleInputChange}
                                   value={this.state.employee.iban}
                                   data-bind="value: employee.iban" type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="department">Department:</label>
                            <select id="department"
                                    name="department"
                                    onChange={this.handleInputChange}
                                    value={this.state.employee.department}
                                    className="form-control">
                                <option>FINANCE</option>
                                <option>HR</option>
                                <option>IT</option>
                                <option>SALES</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="birthYear">Birth Year:</label>
                            <input id="birthYear"
                                   name="birthYear"
                                   onChange={this.handleInputChange}
                                   value={this.state.employee.birthYear}
                                   type="text"
                                   className="form-control"/>
                        </div>
                        <div className="form-group">
                            <div className="checkbox">
                                <label><input
                                    name="fulltime"
                                    onChange={this.handleInputChange}
                                    checked={this.state.employee.fulltime}
                                    type="checkbox"></input>Full time?</label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="photo">Photo</label>
                            <img id="photo"
                                 style={{width: "128px"}}
                                 src={this.state.employee.photo}
                                 className="thumbnail"/>
                            <label className="btn btn-info">
                                <input type="file"
                                       onChange={this.handleFileChange}
                                       style={{display: "none"}}
                                       className="form-control"/>
                                <span>File</span>
                            </label>
                        </div>
                        <div className="form-group">
                            <div id="filedrag"
                                 className="drop-zone">Drop the photo here!
                            </div>
                        </div>
                        <div className="form-group">
                            <button onClick={this.hireEmployee} className="btn btn-info">Add
                            </button>
                            <button onClick={this.updateEmployee} className="btn btn-warning">Update
                            </button>
                            <button onClick={this.fireEmployee} className="btn btn-danger">Delete
                            </button>
                            <button onClick={this.findEmployeeByIdentity} className="btn btn-success">Find
                            </button>
                            <button onClick={this.findEmployees} className="btn btn-success">Find All</button>
                        </div>

                    </div>
                </div>
                <p></p>
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title">Employees</h4>
                    </div>
                    <div className="card-body">
                        <table className="table table-bordered table-striped table-hover">
                            <thead>
                            <tr>
                                <th>No</th>
                                <th>Photo</th>
                                <th>Identity</th>
                                <th>Full Name</th>
                                <th>Iban</th>
                                <th>Salary</th>
                                <th>Full-time?</th>
                                <th>Birth Year</th>
                                <th>Department</th>
                                <th>Operations</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.employees.map((employee, index) => (
                                        <tr onClick={() => this.copyRow(employee)}
                                             key={employee.identity}>
                                            <td>{index + 1}</td>
                                            <td><img className="img-thumbnail" style={{width: '128px'}}
                                                     src={employee.photo}></img></td>
                                            <td>{employee.identity}</td>
                                            <td>{employee.fullname}</td>
                                            <td>{employee.iban}</td>
                                            <td>{employee.fulltime ? 'FULL TIME' : 'PART TIME'}</td>
                                            <td>{employee.birthYear}</td>
                                            <td>{employee.department}</td>
                                            <td>
                                                <button onClick={() => this.fireEmployee(employee.identity)}
                                                        className="btn btn-danger">Fire!
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

}

export default Hr;
