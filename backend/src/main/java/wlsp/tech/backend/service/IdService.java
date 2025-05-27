package wlsp.tech.backend.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
public class IdService {
  public String generateId() {
    return UUID.randomUUID().toString();
  }
}
