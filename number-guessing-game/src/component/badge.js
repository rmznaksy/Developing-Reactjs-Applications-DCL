// stateless component
// js function has no state
// directly return View
// state is passed through parameters as props
export default function Badge(props){
    return(
        <div className="form-group">
            <label className="form-label" htmlFor={props.id}>{props.label}:</label>
            <span id={props.id}
                  className={"badge " +props.className}>{props.value}</span>
        </div>
    );
}