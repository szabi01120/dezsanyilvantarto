import React, { useState, useEffect } from "react";
import { PlusIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { DeliveryNoteService } from "../services/deliveryNoteService";
import DeliveryNotesTable from "../components/delivery-notes/DeliveryNotesTable";
import DeliveryNoteForm from "../components/delivery-notes/DeliveryNoteForm";
import ErrorMessage from "../components/ui/ErrorMessage";
import Spinner from "../components/ui/Spinner";

export default function DeliveryNotes() {
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDeliveryNote, setSelectedDeliveryNote] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadDeliveryNotes();
  }, []);

  const loadDeliveryNotes = async () => {
    try {
      setLoading(true);
      const data = await DeliveryNoteService.getAllDeliveryNotes();
      setDeliveryNotes(data);
    } catch (error) {
      console.error("Hiba a szállítólevelek betöltésekor:", error);
      setError("Nem sikerült betölteni a szállítóleveleket.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeliveryNote = async () => {
    try {
      setCreating(true);
      const newDeliveryNote = await DeliveryNoteService.createDeliveryNote();
      setSelectedDeliveryNote(newDeliveryNote.delivery_note);
      setShowForm(true);
      await loadDeliveryNotes(); // Frissítjük a listát
    } catch (error) {
      console.error("Hiba az új szállítólevél létrehozásakor:", error);
      setError("Nem sikerült létrehozni az új szállítólevelet.");
    } finally {
      setCreating(false);
    }
  };

  const handleEditDeliveryNote = (deliveryNote) => {
    setSelectedDeliveryNote(deliveryNote);
    setShowForm(true);
  };

  const handleDeleteDeliveryNote = async (id) => {
    try {
      await DeliveryNoteService.deleteDeliveryNote(id);
      await loadDeliveryNotes(); // Lista frissítése
      setError(null); // Hiba törlése ha volt
    } catch (error) {
      console.error("Hiba a szállítólevél törlésekor:", error);
      setError("Nem sikerült törölni a szállítólevelet.");
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedDeliveryNote(null);
    loadDeliveryNotes(); // Frissítjük a listát a form bezárásakor
  };

  const totalDeliveryNotes = deliveryNotes.length;
  const totalValue = deliveryNotes.reduce((sum, dn) => sum + dn.total_value, 0);
  const thisMonthDeliveryNotes = deliveryNotes.filter((dn) => {
    const deliveryDate = new Date(dn.delivery_date);
    const now = new Date();
    return (
      deliveryDate.getMonth() === now.getMonth() &&
      deliveryDate.getFullYear() === now.getFullYear()
    );
  }).length;

  if (loading) return <Spinner />;

  if (error && !deliveryNotes.length) {
    return <ErrorMessage message={error} onRetry={loadDeliveryNotes} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
              Szállítólevelek
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Beérkező termékek dokumentálása szállítólevelekkel
            </p>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <button
              onClick={handleCreateDeliveryNote}
              disabled={creating}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              {creating ? "Létrehozás..." : "Új szállítólevél"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DocumentTextIcon
                    className="h-8 w-8 text-blue-500"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Összes szállítólevél
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {totalDeliveryNotes} db
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Ft</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Összes érték
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {totalValue.toLocaleString("hu-HU")} Ft
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">H</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Havi bevételezés
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {thisMonthDeliveryNotes} db
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Á</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Átlagos érték
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {totalDeliveryNotes > 0
                        ? Math.round(
                            totalValue / totalDeliveryNotes
                          ).toLocaleString("hu-HU")
                        : 0}{" "}
                      Ft
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="mt-4">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Content */}
        <div className="mt-8">
          <DeliveryNotesTable
            deliveryNotes={deliveryNotes}
            onEdit={handleEditDeliveryNote}
            onRefresh={loadDeliveryNotes}
            onDelete={handleDeleteDeliveryNote}
          />
        </div>
      </div>

      {/* Form Modal */}
      {showForm && selectedDeliveryNote && (
        <DeliveryNoteForm
          deliveryNote={selectedDeliveryNote}
          onClose={handleCloseForm}
          onSave={handleCloseForm}
        />
      )}
    </div>
  );
}
