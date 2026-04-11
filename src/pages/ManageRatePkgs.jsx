import { useState, useEffect } from 'react';
import { Card } from '@mantine/core';

function ManageRatePkgs({ auth, user }) {

    const API_URL = import.meta.env.VITE_API_URL;

    const [packages, setPackages] = useState([]);

    useEffect(() => {
        fetchPkgs()
    }, [])

    async function fetchPkgs() {
        try {
            const response = await fetch(`${API_URL}/api/carrier-user/user/${user.id}/pkgs`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            const result = await response.json();

            if (!result.packages) {
                alert(result.message)
            }

            console.log(result.packages)

            setPackages(result.packages)

        } catch (error) {
            console.log(error);
        }
    }

    {/* display rates */ }
    {/* add edit and build package features*/ }
    {/*add contract proposal functionality*/ }

    return (
        <div>
            {packages.map(p => (
                <Card key={p.pkgid}>
                    <h2>{p.pkgname}</h2>

                </Card>
            ))}
        </div>
    )
}

export default ManageRatePkgs;