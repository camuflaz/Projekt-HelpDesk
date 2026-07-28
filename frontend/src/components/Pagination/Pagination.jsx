import "./Pagination.css";
import { CgArrowLeft, CgArrowRight } from "react-icons/cg";

function Pagination({page, totalPages, onChange})
{
    return(
        <div className="pagination">
            <button disabled={page === 1} onClick={() => onChange(page - 1)}> <CgArrowLeft /> </button>
            {
                Array.from({length:totalPages},(_,i)=>
                    <button key={i} className={page === i+1 ? "active" : ""}
                    onClick={() => onChange(i + 1)}> {i + 1} </button>
                        )
            }
                <button disabled={page === totalPages} onClick={() => onChange(page + 1)}> <CgArrowRight /> </button>
            
        </div>
    );
}
export default Pagination;