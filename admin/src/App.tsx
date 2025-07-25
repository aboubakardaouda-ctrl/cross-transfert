import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import './App.css';

const firebaseConfig = {
  projectId: 'demo-project',
};

initializeApp(firebaseConfig);
const db = getFirestore();

interface Swap {
  swapId: string;
  orderAId: string;
  orderBId: string;
  status: string;
}

const columns: GridColDef[] = [
  { field: 'swapId', headerName: 'ID', flex: 1 },
  { field: 'orderAId', headerName: 'Order A', flex: 1 },
  { field: 'orderBId', headerName: 'Order B', flex: 1 },
  { field: 'status', headerName: 'Status', flex: 1 },
];

function Admin() {
  const [rows, setRows] = useState<Swap[]>([]);
  useEffect(() => {
    return onSnapshot(collection(db, 'swaps'), (snap) => {
      const data = snap.docs.map((d) => ({ ...(d.data() as any), id: d.id }));
      setRows(data as any);
    });
  }, []);

  async function forceClose(id: string) {
    await updateDoc(doc(db, 'swaps', id), { status: 'DONE' });
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} onRowClick={(p) => forceClose(p.id as string)} />
    </div>
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  return (
    <div>
      <input placeholder="user" value={user} onChange={(e) => setUser(e.target.value)} />
      <input placeholder="pass" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
      <button onClick={() => {
        if (user === import.meta.env.ADMIN_USER && pass === import.meta.env.ADMIN_PASS) onLogin();
      }}>Login</button>
    </div>
  );
}

function App() {
  const [logged, setLogged] = useState(false);
  return logged ? <Admin /> : <Login onLogin={() => setLogged(true)} />;
}

export default App;
