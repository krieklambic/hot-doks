package com.ravioli_inc.hotdoks.repository;

import com.ravioli_inc.hotdoks.model.Hotdog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HotdogRepository extends JpaRepository<Hotdog, Long> {
}
