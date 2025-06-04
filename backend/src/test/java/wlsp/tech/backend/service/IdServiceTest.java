package wlsp.tech.backend.service;

import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class IdServiceTest {

  private final IdService idService = new IdService();

  @Test
  void generateId_returnsValidUUID() {
    String id = idService.generateId();

    assertNotNull(id, "ID sollte nicht null sein");
    assertFalse(id.isBlank(), "ID sollte nicht leer sein");

    assertDoesNotThrow(() -> UUID.fromString(id), "ID sollte gültige UUID sein");

    String anotherId = idService.generateId();
    assertNotEquals(id, anotherId, "Zwei generierte IDs sollten unterschiedlich sein");
  }
}
