package com.example.demo.dao;

import com.example.demo.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long>{
    
    Page<Project> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrCreatorContainingIgnoreCase(
        String title, String description, String creator, Pageable pageable);
}