import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AddTransaction from '../components/AddTransaction';
import { Breadcrumb, Card, Tabs, TabItem } from '../components/auth';

const AddTransactionPage = ({ 
  onAddTransaction, 
  showToast, 
  transactions, 
  categories 
}) => {
  const [activeTab, setActiveTab] = useState('expense');
  
  
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          {/* Header */}
          <div className="welcome-banner animate-fade-in">
            <div className="welcome-content">
              <h1 className="welcome-title">
                <i className="bi bi-plus-circle-fill me-2 me-md-3"></i>
                Tambah Transaksi Baru
              </h1>
              <p className="welcome-subtitle">
                Catat pemasukan atau pengeluaran Anda
              </p>
            </div>
          </div>

          {/* Breadcrumb removed */}

          {/* Add Transaction Form */}
          <Card 
            className="animate-fade-in hover-lift" 
            style={{ animationDelay: '0.2s' }}
            header={
              <h5 className="mb-0">
                <i className="bi bi-wallet2 me-2"></i>
                Detail Transaksi
              </h5>
            }
          >
            <Tabs 
              defaultActiveKey="expense" 
              variant="tabs"
              className="mb-3"
              id="transaction-tabs"
              activeKey={activeTab}
              onSelect={(key) => {
                
                setActiveTab(key);
              }}
            >
              <TabItem 
                eventKey="expense" 
                title={
                  <span>
                    <i className="bi bi-arrow-down-circle-fill text-danger me-2"></i>
                    Pengeluaran
                  </span>
                }
              >
                {activeTab === 'expense' && (
                  <div className="animate-fade-in">
                    {/* Konten tab expense */}
                  </div>
                )}
              </TabItem>
              <TabItem 
                eventKey="income" 
                title={
                  <span>
                    <i className="bi bi-arrow-up-circle-fill text-success me-2"></i>
                    Pemasukan
                  </span>
                }
              >
                {activeTab === 'income' && (
                  <div className="animate-fade-in">
                    {/* Konten tab income */}
                  </div>
                )}
              </TabItem>
            </Tabs>
            
            {/* Render form berdasarkan tab yang aktif */}
            <div className="mt-3">
              <AddTransaction 
                key={activeTab}
                onAddTransaction={onAddTransaction}
                showToast={showToast}
                transactions={transactions}
                categories={categories}
                initialType={activeTab === 'expense' ? 'pengeluaran' : 'pemasukan'}
              />
            </div>
          </Card>

          {/* Quick Tips */}
          <Card 
            className="mt-3 mt-md-4 animate-fade-in hover-lift" 
            style={{ animationDelay: '0.3s' }}
            variant="info"
            outline
            icon="bi bi-lightbulb-fill"
            title="Tips Cepat"
          >
            <ul className="list-unstyled mb-0 small text-muted">
              <li className="mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                Gunakan nama yang deskriptif untuk pelacakan yang mudah
              </li>
              <li className="mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                Pilih kategori yang tepat untuk wawasan yang lebih baik
              </li>
              <li className="mb-0">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                Periksa kembali jumlah sebelum menyimpan
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionPage;