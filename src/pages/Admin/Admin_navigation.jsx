import "./Admin_navigation.css";

function Admin_navigation() {
    return (
        <div className={"admin_navigation"}>
            <nav>
                <ul>
                    <li>
                        <a href="/admin/users">Users</a>
                    </li>
                    <li>
                        <a href="/admin/hardware">Hardware</a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Admin_navigation;