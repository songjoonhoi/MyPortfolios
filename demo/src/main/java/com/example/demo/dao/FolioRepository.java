package com.example.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Folio;

@Repository
public interface FolioRepository extends JpaRepository<Folio, Long>{
    
}
