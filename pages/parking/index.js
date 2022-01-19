import React, { useEffect, useState } from 'react';
import PropTypes, { object } from 'prop-types';
import Layout from '../../src/components/shared/Layout';
import wordingPage from 'src/locale/about';
import fakeData from 'data/parkingPlaces.json';
import { Button, Input, Loader, Modal, Panel, Progress, Table, Tag } from 'rsuite';
import { bubbleSort, generateBlocks } from '../../src/utils/bubbleSortAnimation';
import binarySearch from '@/utils/searchAlg';

const { Column, HeaderCell, Cell, ActionCell } = Table;
let login = '',
  password = '';
const Parking = props => {
  const [loginModal, setLoginModal] = useState(true);
  const handleLogin = () => {
    if (login === 'admin@admin.com' && password === 'admin') setLoginModal(false);
  };
  const efficiency = fakeData.map(el => ({
    ...el,
    efficiency: parseFloat(
      el.loadedIndices *
        el.places *
        (el.distance < 1000
          ? el.distance / 1000
          : el.distance < 2000
          ? el.distance / 10000
          : el.distance < 9999
          ? el.distance / 25000
          : 0.01),
    ).toFixed(2),
  }));

  const handleClick = async sortColumnL => {
    let container = document.querySelector('.data-container');

    for (let i = 1; i <= 3; i++) {
      await new Promise(resolve =>
        setTimeout(() => {
          resolve();
        }, 200),
      );
      container = document.querySelector('.data-container');
      if (i === 3 && !container) return;
    }
    if (!container) return;
    if (!sortColumnL) {
      generateBlocks();
      return bubbleSort(20).then(res => res);
    }

    return new Promise(resolve => {
      const container = document.querySelector('.data-container');
      if (container) container.innerHTML = '';

      generateBlocks(
        Object.keys(efficiency).length,
        efficiency.map(el =>
          sortColumnL === 'loadedIndices'
            ? el[sortColumnL] * 10
            : sortColumnL === 'distance'
            ? el[sortColumnL] / 1000
            : el[sortColumnL],
        ),
      );
      bubbleSort(10).then(res => resolve(res));
    });
  };
  const [sortColumn, setSortColumn] = React.useState();
  const [sortType, setSortType] = React.useState();
  const [loading, setLoading] = React.useState(false);

  const getData = () => {
    if (sortColumn && sortType) {
      return efficiency.sort((a, b) => {
        let x = parseFloat(a[sortColumn]);
        let y = parseFloat(b[sortColumn]);
        if (typeof x === 'string') {
          x = x.charCodeAt();
        }
        if (typeof y === 'string') {
          y = y.charCodeAt();
        }
        if (sortType === 'asc') {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
    return efficiency;
  };
  const [tableData, setTableData] = useState(getData());
  const [bestPlace, setBestPlace] = useState(0);

  const [inputValue, setInputValue] = useState('');
  const searchAlg = string => {
    const newData = getData().filter(({ name }) =>
      name.toLowerCase().includes(string.toLowerCase()),
    );
    setTableData(newData);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      searchAlg(inputValue);
      console.log('render');
    }, 800);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  const handleSortColumn = (sortColumn, sortType) => {
    if (loading) return;
    setLoading(true);
    if (sortType !== 'desc') {
      return setTimeout(() => {
        setLoading(false);
        setSortColumn(sortColumn);
        setSortType(sortType);
      }, 400);
    }
    handleOpen(true);
    setTimeout(() => {
      handleClick(sortColumn).then(resp => {
        const coef = sortColumn === 'loadedIndices' ? 0.1 : sortColumn === 'distance' ? 1000 : 1;
        const result = efficiency.filter(
          el => el[sortColumn] && parseFloat(el[sortColumn]) === parseFloat(resp * coef),
        )[0];
        setBestPlace(
          <span>
            <Tag color="green">{result?.name}</Tag>
            <Tag color="yellow">
              {sortColumn}: {result[sortColumn]}
            </Tag>
          </span>,
        );
        setLoading(false);
        setSortColumn(sortColumn);
        setSortType(sortType);
      });
    }, 0);
  };

  const [showEfficiency, setShowEfficiency] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(20);

  const handleEfficiency = async () => {
    setLoading(true);
    setProgressPercentage(0);
    setShowEfficiency(true);
    for (let i = 1; i <= 5; i++) {
      await new Promise(resolve =>
        setTimeout(() => {
          resolve();
        }, 500),
      );

      setProgressPercentage(i * 20);
      if (i === 5) setLoading(false);
    }
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="modal-container">
      <Layout wordingPage={wordingPage}>
        <h1>Parking Listing</h1>
        <Table
          height={400}
          data={tableData}
          sortColumn={sortColumn}
          sortType={sortType}
          onSortColumn={handleSortColumn}
          loading={loading}
          onRowClick={(data, rowInfo, column) => {}}
        >
          <Column width={70} align="center" fixed sortable>
            <HeaderCell>Id</HeaderCell>
            <Cell dataKey="id" />
          </Column>
          <Column width={200} fixed>
            <HeaderCell>Denumire</HeaderCell>
            <Cell dataKey="name" />
          </Column>
          <Column width={200}>
            <HeaderCell>Regiune</HeaderCell>
            <Cell dataKey="region" />
          </Column>
          {showEfficiency && progressPercentage === 100 && (
            <Column width={300} sortable>
              <HeaderCell style={{ background: 'rgba(238,1,0,0.11)', borderRadius: '8px' }}>
                efficiency
              </HeaderCell>
              <Cell dataKey="efficiency" />
            </Column>
          )}
          <Column width={200} sortable>
            <HeaderCell>Locuri de parcare</HeaderCell>
            <Cell dataKey="places" />
          </Column>
          <Column width={200} sortable>
            <HeaderCell>Index de supraincarcare</HeaderCell>
            <Cell dataKey="loadedIndices" />
          </Column>
          <Column width={200} sortable>
            <HeaderCell>Distanta</HeaderCell>
            <Cell dataKey="distance" />
          </Column>
          <Column width={200} sortable>
            <HeaderCell>Deschide mapa</HeaderCell>
            <Cell dataKey="link" className="no-padding">
              {({ link }, rowIndex) => {
                return (
                  <a href={link}>
                    {link ? (
                      <img
                        style={{ width: 'auto', height: '35px', objectFit: 'cover' }}
                        src="https://img.icons8.com/color/48/000000/google-maps-new.png"
                      />
                    ) : (
                      <img
                        style={{ width: 'auto', height: '35px', objectFit: 'cover' }}
                        src="https://img.icons8.com/ios-filled/48/000000/google-maps-new.png"
                      />
                    )}
                  </a>
                );
              }}
            </Cell>
          </Column>
        </Table>
        <Panel shaded header="Checking for Best Result" className="main-panel">
          <Modal show={open} backdrop keyboard full>
            <h2>Realtime sorting process</h2>
            {!loading && <h4>The best parking place is: {bestPlace && bestPlace}</h4>}
            <section className="data-container" />

            <Button color="red" onClick={handleClose} disabled={loading}>
              Close
            </Button>
          </Modal>
          <Panel bordered>
            <Progress.Line
              percent={progressPercentage}
              status={`${
                showEfficiency && progressPercentage === 100
                  ? 'success'
                  : showEfficiency
                  ? 'active'
                  : 'fail'
              }`}
            />
            <Button color="green" onClick={handleEfficiency}>
              Get Efficiency Coefficient
            </Button>
          </Panel>
        </Panel>
        <Panel bordered style={{ marginBottom: '10rem' }}>
          <Input onChange={setInputValue} placeholder="Search" />
          <Tag>Powered by Binary Search Algorithm</Tag>
        </Panel>

        <Modal show={loginModal} backdrop keyboard full>
          <h1>Please Login</h1>
          <Input
            onChange={str => (login = str)}
            placeholder="User"
            style={{ marginBottom: '1rem' }}
            type="email"
          />
          <Input
            onChange={str => (password = str)}
            placeholder="Password"
            type="password"
            style={{ marginBottom: '2rem' }}
          />
          <Button color="green" onClick={handleLogin}>
            Login
          </Button>
        </Modal>
      </Layout>
      <style>{`
        .main-panel{
        margin-bottom: 5rem;
        }
        .rs-table-cell-content{
        text-transform: Capitalize;
        }
        h1{
        margin-bottom: 2rem;
        }
      `}</style>
    </div>
  );
};
Parking.propTypes = {};
export default Parking;
