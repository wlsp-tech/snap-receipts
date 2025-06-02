package wlsp.tech.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wlsp.tech.backend.model.token.UploadToken;
import wlsp.tech.backend.repository.UploadTokenRepository;

import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UploadTokenService {

  private final UploadTokenRepository uploadTokenRepository;
  private final IdService idService;

  public UploadToken generateTokenForUser(String userId) {
    UploadToken token = new UploadToken(
            idService.generateId(),
            userId,
            Instant.now()
    );
    return uploadTokenRepository.save(token);
  }

  public Optional<UploadToken> validateToken(String tokenId) {
    return uploadTokenRepository.findById(tokenId);
  }

  public void invalidateToken(String tokenId) {
    uploadTokenRepository.deleteById(tokenId);
  }
}
