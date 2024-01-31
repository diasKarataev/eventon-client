import {Link} from "react-router-dom";
import {API_URL} from "../http";
import {useContext} from "react";
import {Context} from "../index";

const Navbar = () => {
    const { store } = useContext(Context);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <a className="navbar-brand" href="index.html">
                    <Link to={`/`}>
                        <img src="logo.png" alt="logo" style={{ width: '100px' }} />
                    </Link>
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <p className="me-2">{store.isAuth ? `${store.user.email}` : ''}</p>
                        <li className="nav-item me-2">
                            <Link to={`/profile`}>
                                {store.user.profilePictureId ?
                                    <img src={`${API_URL}/image/${store.user.profilePictureId}`} alt="mdo" width="35" height="35" className="rounded-circle" />
                                    : ''}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-success" onClick={() => store.logout()}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
