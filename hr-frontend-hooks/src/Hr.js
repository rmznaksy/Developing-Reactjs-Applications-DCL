import './Hr.css';
import React, {useState} from "react";
import Employee from "./model/employee";

export default function Hr() {

    let [employee, setEmployee] = useState(new Employee());
    let [employees, setEmployees] = useState([]);

    function handleInputChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        let newEmployee = {...employee};
        if (name === "fulltime")
            newEmployee.fulltime = !newEmployee.fulltime;
        else
            newEmployee[name] = value;
        setEmployee(newEmployee)
    }

    function handleFileChange(event) {
        const filename = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            let newEmployee = {...employee};
            newEmployee.photo = e.target.result;
            setEmployee(newEmployee)
        }
        reader.readAsDataURL(filename);
    }

    function hireEmployee() {
        let newEmployee = {...employee};
        fetch("http://localhost:9100/hr/api/v1/employees",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(newEmployee)
            }).then(response => response.json())
            .then(response => {
                if (response.hasOwnProperty('message'))
                    alert(response.message);
                else {
                    alert("Employee is hired!");
                    let newEmployees = [...employees]
                    employees.push(response);
                    setEmployees(newEmployees);
                }
            })
    }

    function updateEmployee() {
        let newEmployee = {...employee};

        fetch(`http://localhost:9100/hr/api/v1/employees/${newEmployee.identity}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(newEmployee)
            }).then(response => response.json())
            .then(responseBody => alert("Employee is updated!"))
    }

    function fireEmployee(param) {
        let identity = param;
        if (param.hasOwnProperty('target'))
            identity = employee.identity;
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
                        let newEmployees = employees.filter(emp => emp.identity !== identity);
                        setEmployees(newEmployees);
                    }
                }
            )
    }


    function findEmployeeByIdentity() {
        let identity = employee.identity;
        fetch(`http://localhost:9100/hr/api/v1/employees/${identity}`,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }).then(response => response.json())
            .then(response => {
                if (!response.hasOwnProperty("message"))
                    setEmployee(response);
                else
                    alert(response.message)
            })
    }

    function copyRow(employee) {
        setEmployee(employee);
    }

    function findEmployees() {
        fetch("http://localhost:9100/hr/api/v1/employees?page=0&size=10",
            {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }).then(response => response.json())
            .then(employees => {
                setEmployees(employees);
            })
    }

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
                               onChange={handleInputChange}
                               value={employee.identity}
                               type="text"
                               className="form-control"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Full Name:</label>
                        <input id="name"
                               name="fullname"
                               value={employee.fullname}
                               onChange={handleInputChange}
                               type="text" className="form-control"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="salary">Salary:</label>
                        <input id="salary"
                               name="salary"
                               onChange={handleInputChange}
                               value={employee.salary}
                               type="text" className="form-control"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="iban">Iban:</label>
                        <input id="iban"
                               name="iban"
                               onChange={handleInputChange}
                               value={employee.iban}
                               data-bind="value: employee.iban" type="text" className="form-control"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="department">Department:</label>
                        <select id="department"
                                name="department"
                                onChange={handleInputChange}
                                value={employee.department}
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
                               onChange={handleInputChange}
                               value={employee.birthYear}
                               type="text"
                               className="form-control"/>
                    </div>
                    <div className="form-group">
                        <div className="checkbox">
                            <label><input
                                name="fulltime"
                                onChange={handleInputChange}
                                checked={employee.fulltime}
                                type="checkbox"></input>Full time?</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="photo">Photo</label>
                        <img id="photo"
                             style={{width: "128px"}}
                             src={employee.photo}
                             className="thumbnail"/>
                        <label className="btn btn-info">
                            <input type="file"
                                   onChange={handleFileChange}
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
                        <button onClick={hireEmployee} className="btn btn-info">Add
                        </button>
                        <button onClick={updateEmployee} className="btn btn-warning">Update
                        </button>
                        <button onClick={fireEmployee} className="btn btn-danger">Delete
                        </button>
                        <button onClick={findEmployeeByIdentity} className="btn btn-success">Find
                        </button>
                        <button onClick={findEmployees} className="btn btn-success">Find All</button>
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
                            employees.map((employee, index) => (
                                    <tr onClick={() => copyRow(employee)}
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
                                            <button onClick={() => fireEmployee(employee.identity)}
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