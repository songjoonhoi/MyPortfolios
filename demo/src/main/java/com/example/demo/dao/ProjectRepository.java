package com.example.demo.dao;

import com.example.demo.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long>{
    // 기본 CRUD 제공 (findAll, findById, save, deleteById 등)
    // 필요하면 커스텀 쿼리 메서드 추가 가능
    
} 
