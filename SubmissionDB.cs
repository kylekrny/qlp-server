using Microsoft.EntityFrameworkCore;

class SubmissionDb : DbContext
{
    public SubmissionDb(DbContextOptions<SubmissionDb> options)
        : base(options) { }

        public DbSet<Submission> Submissions => Set<Submission>();
}