import { useState } from 'react';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Alert } from '../components/Alert';

export default function Trends() { 
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-8 flex flex-col gap-4">
      <div>Trends</div>
      <Button onClick={() => setLoading(!loading)} loading={loading}>Primário</Button>
      <Button variant="secondary">Secundário</Button>
      <Button variant="danger" disabled>Danger desabilitado</Button>
      <Badge verdict="fake" />
      <Badge verdict="verdadeiro" />
      <Alert variant="success">Tudo certo!</Alert>
      <Alert variant="error">Algo deu errado!</Alert>
    </div>
  );
}