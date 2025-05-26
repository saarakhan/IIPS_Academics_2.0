import { useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function RejectModal({ resourceId, onClose, onAction }) {
  const [reason, setReason] = useState('');

  const reject = async () => {
    const { error } = await supabase
      .from('resources')
      .update({
        status: 'REJECTED',
        rejection_reason: reason
      })
      .eq('id', resourceId);

    if (!error) {
      onAction();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg w-96">
        <h2 className="font-bold text-lg mb-2">Rejection Reason</h2>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          className="w-full h-24 p-2 border rounded"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="btn">Cancel</button>
          <button onClick={reject} className="btn bg-red-600 text-white">Reject</button>
        </div>
      </div>
    </div>
  );
}
