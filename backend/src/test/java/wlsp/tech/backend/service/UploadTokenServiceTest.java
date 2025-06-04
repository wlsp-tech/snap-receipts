package wlsp.tech.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import wlsp.tech.backend.model.token.UploadToken;
import wlsp.tech.backend.repository.UploadTokenRepository;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UploadTokenServiceTest {

  private UploadTokenRepository uploadTokenRepository;
  private IdService idService;
  private UploadTokenService uploadTokenService;

  @BeforeEach
  void setUp() {
    uploadTokenRepository = mock(UploadTokenRepository.class);
    idService = mock(IdService.class);
    uploadTokenService = new UploadTokenService(uploadTokenRepository, idService);
  }

  @Test
  void generateTokenForUser_savesAndReturnsToken() {
    String userId = "user-123";
    String generatedId = "token-456";

    when(idService.generateId()).thenReturn(generatedId);
    when(uploadTokenRepository.save(any(UploadToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

    UploadToken token = uploadTokenService.generateTokenForUser(userId);

    assertNotNull(token);
    assertEquals(generatedId, token.id());
    assertEquals(userId, token.userId());
    assertNotNull(token.createdAt());

    verify(idService).generateId();
    verify(uploadTokenRepository).save(token);
  }

  @Test
  void validateToken_existingToken_returnsOptionalToken() {
    String tokenId = "token-789";
    UploadToken token = new UploadToken(tokenId, "user-abc", Instant.now());

    when(uploadTokenRepository.findById(tokenId)).thenReturn(Optional.of(token));

    Optional<UploadToken> result = uploadTokenService.validateToken(tokenId);

    assertTrue(result.isPresent());
    assertEquals(token, result.get());

    verify(uploadTokenRepository).findById(tokenId);
  }

  @Test
  void validateToken_nonExistingToken_returnsEmptyOptional() {
    String tokenId = "non-existing";

    when(uploadTokenRepository.findById(tokenId)).thenReturn(Optional.empty());

    Optional<UploadToken> result = uploadTokenService.validateToken(tokenId);

    assertTrue(result.isEmpty());

    verify(uploadTokenRepository).findById(tokenId);
  }

  @Test
  void invalidateToken_deletesTokenById() {
    String tokenId = "token-to-delete";

    uploadTokenService.invalidateToken(tokenId);

    verify(uploadTokenRepository).deleteById(tokenId);
  }
}
