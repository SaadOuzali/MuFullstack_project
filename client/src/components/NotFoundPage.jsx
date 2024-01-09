import { useNavigate } from "react-router-dom";
import "../styles/pagenotfound.css";
import { useCallback } from "react";

const PageNotFound = () => {
  const navigate = useNavigate();

  const goHome = useCallback(() => {
    navigate("/home/");
  }, [navigate]);

  return (
    <>
      <div className="page-404-container">
        <div className="content-container d-flex flex-column justify-content-center align-items-center">
          <div>
            <p className="text-404">404</p>
          </div>
          <div>
            <p className="paragraph-404">Oops! Page Not Found!</p>
          </div>
          <div>
            <button className="btn btn-dark button-404" onClick={goHome}>
              Go Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageNotFound;
