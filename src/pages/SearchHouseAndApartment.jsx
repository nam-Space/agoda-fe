import { Layout, Row, Col, ConfigProvider } from 'antd';
import React, { useState } from 'react';
import ClientLayout from "layouts/ClientLayout";
import SearchBar from "components/Search/SearchBar";
import FilterSidebar from 'components/Search/FilterSidebar';
import HotelList from 'components/Search/HotelList';
import { mockHotels } from 'components/Search/data/mockHotels';

const { Content } = Layout;

const SearchHouseAndApartment= () => {
    const [hotels, setHotels] = useState(mockHotels);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({});

    const handleSearch = (searchValues) => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
        setHotels(mockHotels);
        setLoading(false);
        }, 1000);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <ClientLayout>
            <Content className="p-6">
                <div className="max-w-6xl mx-auto">
                    <SearchBar onSearch={handleSearch}/>
                    
                    <Row gutter={24}>
                    <Col xs={24} lg={6}>
                        <FilterSidebar 
                        filters={filters} 
                        onFilterChange={handleFilterChange} 
                        />
                    </Col>
                    
                    <Col xs={24} lg={18}>
                        <HotelList hotels={hotels} loading={loading} />
                    </Col>
                    </Row>
                </div>
            </Content>
        </ClientLayout>
    );
};

export default SearchHouseAndApartment;
