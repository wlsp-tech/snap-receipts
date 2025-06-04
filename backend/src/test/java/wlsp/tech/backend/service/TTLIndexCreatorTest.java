package wlsp.tech.backend.service;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexOperations;
import wlsp.tech.backend.model.token.UploadToken;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class TTLIndexCreatorTest {

  @Test
  void createsTTLIndex() {
    MongoTemplate mongoTemplate = mock(MongoTemplate.class);
    IndexOperations indexOperations = mock(IndexOperations.class);
    ApplicationArguments args = mock(ApplicationArguments.class);

    when(mongoTemplate.indexOps(UploadToken.class)).thenReturn(indexOperations);
    when(indexOperations.createIndex(any(Index.class))).thenReturn(null);

    TTLIndexCreator ttlIndexCreator = new TTLIndexCreator(mongoTemplate);
    ttlIndexCreator.run(args);

    ArgumentCaptor<Index> indexCaptor = ArgumentCaptor.forClass(Index.class);
    verify(indexOperations, times(1)).createIndex(indexCaptor.capture());

    Index capturedIndex = indexCaptor.getValue();

    Index expectedIndex = new Index()
            .on("createdAt", Sort.Direction.ASC)
            .expire(3600);

    assertThat(capturedIndex.toString()).isEqualTo(expectedIndex.toString());
  }
}
